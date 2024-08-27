using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Services;

namespace Scheduler.Application.Queries.Events;

public class GetEventAttendentsQueryHandler(IMapper mapper,
    IRepository<Event> eventRepository,
    IRepository<GroupMemberLink> groupMembersRepository,
    IRepository<EventParticipance> eventParticipanceRepository,
    MembershipService membershipService) : IRequestHandler<GetEventAttendentsQuery, List<EventAttendenceDto>>
{
    public async Task<List<EventAttendenceDto>> Handle(GetEventAttendentsQuery request, CancellationToken cancellationToken)
    {
        var ev = await eventRepository.GetById(request.EventId);
        var attendies = new List<EventAttendenceDto>();
        if (ev.Group != null)
        {
            var groupMembers = groupMembersRepository.Query().Where(x => x.Group.Id == ev.Group.Id).ToList();
            var eventParticipants = eventParticipanceRepository.Query().Where(x => x.Event.Id == ev.Id).ToList();
            foreach (var groupMember in groupMembers)
            {
                var attendy = new EventAttendenceDto()
                {
                    Client = mapper.Map<ClientDto>(groupMember.Client),
                    IsAttendant = eventParticipants.Count(x => x.Client.Id == groupMember.Client.Id) > 0,
                    GroupMemberId = groupMember.Group.Id,
                    Membership = await membershipService.GetActualMembership(groupMember.Client.Id, ev.Group.Style.Id, ev.StartDateTime)
                };
                attendies.Add(attendy);
            }
        }

        return attendies;
    }
}