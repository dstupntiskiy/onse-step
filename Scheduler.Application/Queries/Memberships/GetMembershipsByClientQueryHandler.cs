using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Services;

namespace Scheduler.Application.Queries.Memberships;

public class GetMembershipsByClientQueryHandler(IMapper mapper,
    IRepository<Membership> membershipRepository,
    MembershipService membershipService) : IRequestHandler<GetMembershipsByClientQuery, List<MembershipWithDetailsDto>>
{
    public async Task<List<MembershipWithDetailsDto>> Handle(GetMembershipsByClientQuery request,
        CancellationToken cancellationToken)
    {
        var memberships = membershipRepository.Query().Where(x => x.Client.Id == request.ClientId).ToList();

        var membershipsWithDetails = Task.WhenAll(memberships.Select(async x =>
        {
            var membershipWithDetails = mapper.Map<MembershipWithDetailsDto>(x);
            (membershipWithDetails.Visited, membershipWithDetails.Expired) = await membershipService.GetVisitedCount(request.ClientId, x.Id, null) ;
            
            return membershipWithDetails;
        })).Result.OrderByDescending(x => x.StartDate).ToList();
        return membershipsWithDetails;
    }
}