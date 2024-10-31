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
    IRepository<Membership> membershipRepository,
    IRepository<OneTimeVisit> oneTimeVisitRepository,
    IRepository<EventCoachSubstitution> eventCoachSubstitutionRepository,
    IRepository<EventParticipance> eventParticipanceRepository,
    IMapper mapper)
    : IRequestHandler<GetAllCoachesEventsWithParticipantsByPeriodQuery, List<CoachWithEventsDto>>
{
    public async Task<List<CoachWithEventsDto>> Handle(GetAllCoachesEventsWithParticipantsByPeriodQuery request,
        CancellationToken cancellationToken)
    {
        var events = eventRepository.Query().Where(x => x.StartDateTime >= request.StartDate
                                                        && x.StartDateTime <= request.EndDate
                                                        && x.EventType == EventType.Event).ToList();
        var eventWithCounts = events.Select(x =>
        {
            var substitution = eventCoachSubstitutionRepository.Query().SingleOrDefault(y => y.Event.Id == x.Id);
            var ev = x;
            ev.Coach = substitution != null ? substitution.Coach : ev.Coach;
            return new
            {
                Event = ev,
                OnetimeVisits = oneTimeVisitRepository.Query().Count(y => y.Event.Id == x.Id),
                MembershipsCount = membershipRepository.Query().Count(y => y.StartDate <= x.StartDateTime &&
                                                                           y.EndDate >= x.StartDateTime
                                                                           && (y.Style != null && x.Group != null)
                                                                           && y.Style.Id == x.Group.Style.Id
                ),
                ParticipantsCount = eventParticipanceRepository.Query().Count(y => y.Event.Id == x.Id)

            };
        }).ToList();

        
        var coachesWithEvents = new List<CoachWithEventsDto>();
        eventWithCounts.GroupBy(x => x.Event.Coach).ToList().ForEach(x =>
        {
            coachesWithEvents.Add(new CoachWithEventsDto
            {
                Coach = mapper.Map<CoachDto>(x.Key),
                EventWithParticipants = x.Select(y => new EventWithParticipantsDto
                {
                    Name = y.Event.Name,
                    StartDate = y.Event.StartDateTime,
                    OnetimeVisitsCount = y.OnetimeVisits,
                    MembershipsCount = y.MembershipsCount,
                    ParticipantsCount = y.ParticipantsCount
                }).ToList()
            });
        });
        
        return coachesWithEvents;
    }
}