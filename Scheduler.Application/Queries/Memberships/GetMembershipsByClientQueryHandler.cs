using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Memberships;

public class GetMembershipsByClientQueryHandler(IMapper mapper,
    IRepository<Membership> membershipRepository,
    IRepository<EventParticipance> eventParticipanceRepository) : IRequestHandler<GetMembershipsByClientQuery, List<MembershipWithDetailsDto>>
{
    public async Task<List<MembershipWithDetailsDto>> Handle(GetMembershipsByClientQuery request,
        CancellationToken cancellationToken)
    {
        var memberships = membershipRepository.Query().Where(x => x.Client.Id == request.ClientId).ToList();
        var participance = eventParticipanceRepository.Query().Where(x => x.Client.Id == request.ClientId).ToList();

        var membershipsWithDetails = memberships.Select(x =>
        {
            var membershipWithDetails = mapper.Map<MembershipWithDetailsDto>(x);
            membershipWithDetails.Visited = participance.Count(y =>
                x.StartDate <= y.Event.StartDateTime && x.EndDate > y.Event.StartDateTime);
            return membershipWithDetails;
        }).ToList();
        return membershipsWithDetails;
    }
}