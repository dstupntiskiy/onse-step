using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Common.Dtos.Reports;
using Scheduler.Application.Entities;
using Scheduler.Application.Enums;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Services;

namespace Scheduler.Application.Queries.Reports.GetAllCoachesEventsWithParticipants;

public class GetAllCoachesEventsWithParticipantsByPeriodQueryHandler(
    IRepository<Event> eventRepository,
    MembershipService membershipService,
    IRepository<OneTimeVisit> oneTimeVisitRepository,
    IRepository<EventCoachSubstitution> eventCoachSubstitutionRepository,
    IRepository<EventParticipance> eventParticipanceRepository,
    IRepository<GroupMemberLink> groupMemberRepository,
    IMapper mapper)
    : IRequestHandler<GetAllCoachesEventsWithParticipantsByPeriodQuery, List<CoachWithEventsDto>>
{
    public const int MIN_MEMBERS = 5;
    public async Task<List<CoachWithEventsDto>> Handle(GetAllCoachesEventsWithParticipantsByPeriodQuery request,
        CancellationToken cancellationToken)
    {
        var events = eventRepository.Query().Where(x => x.StartDateTime >= request.StartDate
                                                        && x.StartDateTime <= request.EndDate
                                                        && x.EventType == EventType.Event
                                                        && x.Group != null).ToList();

        events = UpdateCoachFromSub(events);
        
        var coachesWithEvents = new List<CoachWithEventsDto>();

        events.GroupBy(x => x.Coach).ToList()
            .ForEach(x =>
            {
                coachesWithEvents.Add(new CoachWithEventsDto
                {
                    Coach = mapper.Map<CoachDto>(x.Key),
                    EventWithParticipants = Task.WhenAll(
                            x.Select(async ev => await GetEventWithParticipants(ev)))
                        .Result
                        .OrderBy(ev => ev.Name)
                        .ThenBy(ev => ev.StartDate).ToList()
                });
            });
        
        return coachesWithEvents.OrderBy(x => x.Coach?.Name ?? string.Empty).ToList();
    }

    private async Task<int> GetMembersCount(Event ev)
    {
        var count = 0;
        var members = groupMemberRepository.Query().Where(x => ev.Group != null && x.Group.Id == ev.Group.Id).ToList().Select(x => x.Client);
        foreach (var member in members)
        {
            var membership = await membershipService.GetActualMembership(member.Id, ev.Group!.Style.Id, ev.StartDateTime);

            
            if (membership is { Expired: false }
                && (membership is not { Unlimited: true } || eventParticipanceRepository.Query().Any(x => x.Client.Id == membership.Client.Id && x.Event.Id == ev.Id)))
            {
                count += 1;
            }
        }

        return count;
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
    
    private async Task<EventWithParticipantsDto> GetEventWithParticipants(Event ev)
    {
        var onetimeVisitsCount = oneTimeVisitRepository.Query().Count(y => y.Event.Id == ev.Id);
        var membersCount = await GetMembersCount(ev);
        var additionalMembers = onetimeVisitsCount + membersCount - MIN_MEMBERS;

        var baseSalary = (int)ev.Group.Style.BaseSalary;
        var bonusSalary = additionalMembers > 0 ? additionalMembers * (int)ev.Group.Style.BonusSalary : 0;
        return new EventWithParticipantsDto
        {
            Name = ev.Name,
            StartDate = ev.StartDateTime,
            OnetimeVisitsCount = onetimeVisitsCount,
            ParticipantsCount = eventParticipanceRepository.Query().Count(y => y.Event.Id == ev.Id),
            MembersCount = membersCount,
            BaseSalary = (int)ev.Group.Style.BaseSalary,
            BonusSalary = bonusSalary,
            TotalSalary = baseSalary + bonusSalary
        };
    }
}