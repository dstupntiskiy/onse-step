using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Scheduler.Application.Entities;
using Scheduler.Application.Enums;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Queries.Reports.GetAllCoachesEventsWithParticipants;

internal static class CoachReportChecks
{
    public static async Task Run(IServiceProvider services)
    {
        var start = new DateTime(2026, 9, 1);
        var end = start.AddMonths(1).AddTicks(-1);
        var style = new Style { Id = Guid.NewGuid(), BaseSalary = 1000.50m, BonusSalary = 125.25m };
        var coach = new Coach { Id = Guid.NewGuid(), Name = "Anna", Style = style };
        var substitute = new Coach { Id = Guid.NewGuid(), Name = "Boris", Style = style };
        var events = new List<Event>();
        var participants = new List<EventParticipance>();
        var payments = new List<OneTimeVisitPayment>();

        Event Lesson(string name, int attendance, DateTime? date = null, Style? direction = null)
        {
            var lesson = new Event
            {
                Id = Guid.NewGuid(), Name = name, StartDateTime = date ?? start.AddDays(1),
                EventType = EventType.Event, Coach = coach,
                Group = new Group { Id = Guid.NewGuid(), Style = direction ?? style }
            };
            events.Add(lesson);
            for (var i = 0; i < attendance; i++)
                participants.Add(new EventParticipance
                {
                    Id = Guid.NewGuid(), Event = lesson, Client = new Client { Id = Guid.NewGuid() }
                });
            return lesson;
        }

        OneTimeVisit Visit(Event lesson, decimal? amount, Client? client = null)
        {
            var visit = new OneTimeVisit
            {
                Id = Guid.NewGuid(), Event = lesson, Client = client ?? new Client { Id = Guid.NewGuid() }
            };
            if (amount.HasValue)
                payments.Add(new OneTimeVisitPayment
                {
                    Id = Guid.NewGuid(), OneTimeVisit = visit, Amount = amount.Value,
                    // Salary belongs to the lesson period even when payment was recorded later.
                    CreateDate = end.AddDays(1)
                });
            return visit;
        }

        Lesson("Empty", 0, start);
        Lesson("Four", 4);
        var five = Lesson("Five", 5);
        Visit(five, null);
        Visit(five, 0);
        Visit(five, -100);
        Lesson("Six without memberships", 6);
        var mixed = Lesson("Mixed", 4);
        Visit(mixed, 700);
        var splitVisit = Visit(mixed, 200);
        payments.Add(new OneTimeVisitPayment { Id = Guid.NewGuid(), OneTimeVisit = splitVisit, Amount = 300 });
        Visit(mixed, null);
        var paidOnly = Lesson("Paid only", 0);
        for (var i = 0; i < 7; i++) Visit(paidOnly, 700);

        var duplicates = Lesson("Duplicates", 5);
        var existing = participants.First(x => x.Event == duplicates);
        participants.Add(new EventParticipance { Id = Guid.NewGuid(), Event = duplicates, Client = existing.Client });
        Visit(duplicates, 700, existing.Client);

        var otherStyle = new Style { Id = Guid.NewGuid(), BaseSalary = 2000.75m, BonusSalary = 80.50m };
        var replaced = Lesson("Substitution", 8, end, otherStyle);
        Lesson("Before period", 20, start.AddTicks(-1));
        Lesson("After period", 20, end.AddTicks(1));
        Lesson("Rent", 20).EventType = EventType.Rent;
        Lesson("Special", 20).EventType = EventType.SpecialEvent;
        Lesson("Without group", 20).Group = null;

        var handler = new GetAllCoachesEventsWithParticipantsByPeriodQueryHandler(
            new ReadOnlyRepository<Event>(events), new ReadOnlyRepository<OneTimeVisitPayment>(payments),
            new ReadOnlyRepository<EventCoachSubstitution>([
                new EventCoachSubstitution { Event = replaced, Coach = substitute }
            ]), new ReadOnlyRepository<EventParticipance>(participants), services.GetRequiredService<IMapper>());
        var query = new GetAllCoachesEventsWithParticipantsByPeriodQuery(start, end);
        var report = await handler.Handle(query, default);
        var lessons = report.SelectMany(x => x.EventWithParticipants).ToDictionary(x => x.Name);
        Check(lessons.Count == 8, "Only group lessons within the requested period contribute salary.");
        foreach (var name in new[] { "Empty", "Four", "Five", "Duplicates" })
            Check(lessons[name].BonusSalary == 0 && lessons[name].TotalSalary == 1000.50m,
                $"{name}: base salary applies with no bonus up to five people.");
        Check(lessons["Five"].OnetimeVisitsCount == 0 && lessons["Five"].ParticipantsCount == 5,
            "Unpaid, zero and negative payments do not increase attendance for salary.");
        Check(lessons["Six without memberships"].BonusSalary == 125.25m,
            "The sixth attendee earns a bonus without any group membership or subscription records.");
        Check(lessons["Mixed"].MembersCount == 4 && lessons["Mixed"].OnetimeVisitsCount == 2 &&
              lessons["Mixed"].ParticipantsCount == 6 && lessons["Mixed"].TotalSalary == 1125.75m,
            "Group attendance and paid visits combine; split payments count once regardless of payment date.");
        Check(lessons["Paid only"].ParticipantsCount == 7 && lessons["Paid only"].BonusSalary == 250.50m,
            "Paid one-time visits count without separate group attendance marks.");
        Check(lessons["Duplicates"].ParticipantsCount == 5 && lessons["Duplicates"].MembersCount == 4 &&
              lessons["Duplicates"].OnetimeVisitsCount == 1, "Duplicate attendance and overlapping paid visits count each person once.");
        Check(lessons["Substitution"].BaseSalary == 2000.75m && lessons["Substitution"].BonusSalary == 241.50m,
            "Each lesson uses its own style's base and per-person rates without truncating decimals.");
        Check(report.Single(x => x.Coach.Id == substitute.Id).TotalSalary == 2242.25m &&
              report.Single(x => x.Coach.Id == coach.Id).TotalSalary == 7504.50m,
            "Salary totals retain decimal precision and substitutions credit the replacement coach.");
        Check(report.All(x => x.EventWithParticipants.All(ev => ev.ParticipantsCount == ev.MembersCount + ev.OnetimeVisitsCount)),
            "Displayed attendance categories reconcile with the salary count.");
        Check((await handler.Handle(query with { StartDate = end.AddDays(10), EndDate = end.AddDays(11) }, default)).Count == 0,
            "An empty period produces an empty report.");
        Console.WriteLine("PASS: Coach salaries use attendance, paid visits, per-style rates, threshold, deduplication and substitutions.");
    }

    private static void Check(bool condition, string message)
    {
        if (!condition) throw new Exception(message);
    }

    private sealed class ReadOnlyRepository<T>(IEnumerable<T> entities) : IRepository<T>
    {
        public IQueryable<T> Query() => entities.AsQueryable();
        public Task<T>? GetById(Guid id) => throw new NotSupportedException();
        public Task<List<T>> GetAll() => throw new NotSupportedException();
        public Task<T> AddAsync(T entity) => throw new NotSupportedException();
        public Task<T> UpdateAsync(T entity, CancellationToken cancellationToken) => throw new NotSupportedException();
        public Task DeleteAsync(Guid id, CancellationToken cancellationToken) => throw new NotSupportedException();
    }
}
