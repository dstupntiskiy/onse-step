using System.ComponentModel.DataAnnotations;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using NHibernate;
using Scheduler.Application.Commands.Events.ChangeEventGroup;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Base;
using Scheduler.Application.Enums;
using Scheduler.Application.Interfaces;
using Scheduler.Infrastructure.Repository;

internal static class EventGroupChecks
{
    public static async Task Run(IServiceProvider services)
    {
        foreach (var recurrent in new[] { false, true })
        {
            await CheckChange(services, recurrent, false, false);
            await CheckChange(services, recurrent, true, false);
        }
        await CheckChange(services, true, false, true);
        await CheckOrdinarySave(services);
        Console.WriteLine("PASS: Group changes update the whole series atomically, reject attendance and preserve single events and one-time visits.");
    }

    private static async Task CheckChange(IServiceProvider services, bool recurrent, bool attended, bool failWrite)
    {
        var oldGroup = new Group { Id = Guid.NewGuid(), Name = "Previous" };
        var newGroup = new Group { Id = Guid.NewGuid(), Name = "Next" };
        var recurrence = new Recurrence { Id = Guid.NewGuid(), StartDate = DateTime.Today,
            EndDate = DateTime.Today.AddMonths(1), DaysOfWeek = [DayOfWeek.Monday] };
        var coach = new Coach { Id = Guid.NewGuid(), Name = "Coach" };
        Event MakeEvent(int day, Recurrence? series) => new() { Id = Guid.NewGuid(), Group = oldGroup,
            Recurrence = series, Name = $"Lesson {day}", StartDateTime = DateTime.Today.AddDays(day),
            EndDateTime = DateTime.Today.AddDays(day).AddHours(1), Color = "teal", Coach = coach };
        var selected = MakeEvent(7, recurrent ? recurrence : null);
        var earlier = MakeEvent(0, recurrent ? recurrence : null);
        var later = MakeEvent(14, recurrent ? recurrence : null);
        var unrelated = MakeEvent(21, null);
        var all = new List<Event> { selected, earlier, later, unrelated };
        var expected = recurrent ? new[] { selected, earlier, later } : new[] { selected };
        var attendance = new List<EventParticipance>();
        if (attended) attendance.Add(new() { Event = recurrent ? later : selected, Client = new Client() });
        // Attendance outside this series must not prevent a group change.
        attendance.Add(new() { Event = unrelated, Client = new Client() });
        var visit = new OneTimeVisit { Id = Guid.NewGuid(), Event = selected, Client = new Client() };
        var payment = new OneTimeVisitPayment { Id = Guid.NewGuid(), OneTimeVisit = visit, Amount = 1000 };
        var snapshot = all.Select(ev => (ev.Id, ev.Name, ev.StartDateTime, ev.EndDateTime, ev.Color, ev.Coach, ev.Recurrence)).ToArray();
        var writes = new List<Event>();
        var committed = false;
        var rolledBack = false;
        var transaction = GroupCopyChecks.CallProxy.Create<ITransaction>((method, _) => method.Name switch
        {
            "CommitAsync" => Complete(() => committed = true),
            "RollbackAsync" => Complete(() => rolledBack = true),
            "Dispose" => null,
            _ => throw new NotSupportedException(method.Name)
        });
        var session = GroupCopyChecks.CallProxy.Create<ISession>((method, args) =>
        {
            if (method.Name == "BeginTransaction") return transaction;
            if (method.Name != "UpdateAsync") throw new NotSupportedException(method.Name);
            writes.Add((Event)args![0]!);
            return failWrite && writes.Count == 2
                ? Task.FromException(new InvalidOperationException("Simulated storage failure"))
                : Task.CompletedTask;
        });
        var writer = new EventGroupWriter(session, new MemoryRepository<Event>(all),
            new MemoryRepository<Group>([oldGroup, newGroup]), new MemoryRepository<EventParticipance>(attendance), new CurrentUser());
        var handler = new ChangeEventGroupCommandHandler(writer, services.GetRequiredService<IMapper>());

        // Validate missing records and wrong event type without any writes.
        await Reject(() => handler.Handle(new(Guid.NewGuid(), newGroup.Id), default));
        await Reject(() => handler.Handle(new(selected.Id, Guid.NewGuid()), default));
        selected.EventType = EventType.Rent;
        await Reject(() => handler.Handle(new(selected.Id, newGroup.Id), default));
        selected.EventType = EventType.Event;
        Check(writes.Count == 0, "Invalid input cannot write events.");
        committed = rolledBack = false;

        if (attended)
        {
            await Reject(() => handler.Handle(new(selected.Id, newGroup.Id), default));
            Check(writes.Count == 0 && all.All(ev => ev.Group == oldGroup), "Attendance must reject the entire change before mutations.");
        }
        else
        {
            try
            {
                var result = await handler.Handle(new(selected.Id, newGroup.Id), default);
                Check(!failWrite, "Write failures must propagate.");
                Check(result.Select(ev => ev.Id).ToHashSet().SetEquals(expected.Select(ev => ev.Id)), "All and only occurrences in the series must be returned.");
                Check(expected.All(ev => ev.Group == newGroup && ev.ModifiedBy == "test-user"), "Every occurrence must use the new group and audit data.");
                Check(unrelated.Group == oldGroup, "Unrelated single events must be preserved.");
                Check(writes.Count == expected.Length, "Single events must change only once.");
                await handler.Handle(new(selected.Id, newGroup.Id), default);
                Check(writes.Count == expected.Length, "Saving the same group is a no-op.");
            }
            catch (InvalidOperationException) when (failWrite) { }
        }
        Check(committed == (!attended && !failWrite) && rolledBack == (attended || failWrite), "The whole operation must commit or roll back together.");
        Check(snapshot.SequenceEqual(all.Select(ev => (ev.Id, ev.Name, ev.StartDateTime, ev.EndDateTime, ev.Color, ev.Coach, ev.Recurrence))), "Group changes must preserve event identities, dates, names, coaches and recurrences.");
        Check(visit.Event == selected && payment.OneTimeVisit == visit && payment.Amount == 1000, "One-time visits and payments must remain attached to the same event.");
    }

    private static async Task CheckOrdinarySave(IServiceProvider services)
    {
        var group = new Group { Id = Guid.NewGuid() };
        var ev = new Event { Id = Guid.NewGuid(), Group = group, Name = "Existing" };
        var handler = new Scheduler.Application.Commands.Events.EventSave.CommandHandler(
            new MemoryRepository<Event>([ev]), new MemoryRepository<Recurrence>([]),
            new MemoryRepository<Group>([group]), new MemoryRepository<Coach>([]), services.GetRequiredService<IMapper>());
        await Reject(() => handler.Handle(new(ev.Id, "Changed", DateTime.Today, DateTime.Today.AddHours(1),
            null, Guid.NewGuid(), null, false, null, null, null, null, null, EventType.Event, true), default));
        Check(ev.Name == "Existing" && ev.Group == group, "Ordinary saves cannot bypass the group-change validation.");
    }

    private static async Task Reject(Func<Task> action)
    {
        try { await action(); }
        catch (ValidationException) { return; }
        throw new Exception("Invalid group change was accepted.");
    }
    private static Task Complete(Action action) { action(); return Task.CompletedTask; }
    private static void Check(bool condition, string message) { if (!condition) throw new Exception(message); }
    private sealed class CurrentUser : ICurrentUserService { public string UserId => "test-user"; }
    private sealed class MemoryRepository<T>(List<T> items) : IRepository<T> where T : AuditableEntity
    {
        public IQueryable<T> Query() => items.AsQueryable();
        public Task<T> GetById(Guid id) => Task.FromResult(items.SingleOrDefault(entity => entity.Id == id)!);
        public Task<List<T>> GetAll() => Task.FromResult(items);
        public Task<T> AddAsync(T entity) => throw new NotSupportedException();
        public Task<T> UpdateAsync(T entity, CancellationToken token) => throw new NotSupportedException();
        public Task DeleteAsync(Guid id, CancellationToken token) => throw new NotSupportedException();
    }
}
