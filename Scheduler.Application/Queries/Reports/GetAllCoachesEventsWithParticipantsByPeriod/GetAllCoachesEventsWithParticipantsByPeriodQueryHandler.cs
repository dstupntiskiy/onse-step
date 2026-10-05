using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Common.Dtos.Reports;
using Scheduler.Application.Entities;
using Scheduler.Application.Enums;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Reports.GetAllCoachesEventsWithParticipants;

public class GetAllCoachesEventsWithParticipantsByPeriodQueryHandler(
    IRepository<Event> eventRepository,
    IRepository<OneTimeVisitPayment> oneTimeVisitPaymentRepository,
    IRepository<EventCoachSubstitution> eventCoachSubstitutionRepository,
    IRepository<EventParticipance> eventParticipanceRepository,
    IMapper mapper)
    : IRequestHandler<GetAllCoachesEventsWithParticipantsByPeriodQuery, List<CoachWithEventsDto>>
{
    public const int MIN_MEMBERS = 5;
    public Task<List<CoachWithEventsDto>> Handle(GetAllCoachesEventsWithParticipantsByPeriodQuery request,
        CancellationToken cancellationToken)
    {
        var events = eventRepository.Query().Where(x => x.StartDateTime >= request.StartDate
                                                        && x.StartDateTime <= request.EndDate
                                                        && x.EventType == EventType.Event
                                                        && x.Group != null).ToList();

        events = UpdateCoachFromSub(events);

        var eventIds = events.Select(x => x.Id).ToList();
        var participants = eventParticipanceRepository.Query()
            .Where(x => eventIds.Contains(x.Event.Id))
            .Select(x => new { EventId = x.Event.Id, ClientId = x.Client.Id })
            .ToList().ToLookup(x => x.EventId, x => x.ClientId);
        var paidVisitors = oneTimeVisitPaymentRepository.Query()
            .Where(x => eventIds.Contains(x.OneTimeVisit.Event.Id) && x.Amount > 0)
            .Select(x => new { EventId = x.OneTimeVisit.Event.Id, ClientId = x.OneTimeVisit.Client.Id })
            .ToList().ToLookup(x => x.EventId, x => x.ClientId);
        
        var coachesWithEvents = new List<CoachWithEventsDto>();

        events.GroupBy(x => x.Coach).ToList()
            .ForEach(x =>
            {
                coachesWithEvents.Add(new CoachWithEventsDto
                {
                    Coach = mapper.Map<CoachDto>(x.Key),
                    EventWithParticipants = x.Select(ev => GetEventWithParticipants(
                            ev, participants[ev.Id], paidVisitors[ev.Id]))
                        .OrderBy(ev => ev.Name)
                        .ThenBy(ev => ev.StartDate).ToList()
                });
            });
        
        return Task.FromResult(coachesWithEvents.OrderBy(x => x.Coach?.Name ?? string.Empty).ToList());
    }

    private List<Event> UpdateCoachFromSub(List<Event> events)
    {
        return events.Select(x =>
        {
            var substitution = eventCoachSubstitutionRepository.Query().SingleOrDefault(y => y.Event.Id == x.Id);
            x.Coach = substitution != null ? substitution.Coach : x.Coach;
            return x;
        }).ToList();
    }
    
    private static EventWithParticipantsDto GetEventWithParticipants(
        Event ev, IEnumerable<Guid> participants, IEnumerable<Guid> paidVisitors)
    {
        var paidVisitorIds = paidVisitors.ToHashSet();
        // Count people once even if attendance or payment records overlap.
        var membersCount = participants.Except(paidVisitorIds).Count();
        var participantsCount = membersCount + paidVisitorIds.Count;
        var additionalMembers = Math.Max(0, participantsCount - MIN_MEMBERS);

        var baseSalary = ev.Group!.Style.BaseSalary;
        var bonusSalary = additionalMembers * ev.Group.Style.BonusSalary;
        return new EventWithParticipantsDto
        {
            Name = ev.Name,
            StartDate = ev.StartDateTime,
            OnetimeVisitsCount = paidVisitorIds.Count,
            ParticipantsCount = participantsCount,
            MembersCount = membersCount,
            BaseSalary = baseSalary,
            BonusSalary = bonusSalary,
            TotalSalary = baseSalary + bonusSalary
        };
    }
}
