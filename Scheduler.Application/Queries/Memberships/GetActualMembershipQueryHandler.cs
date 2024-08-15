using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Services;

namespace Scheduler.Application.Queries.Memberships;

public class GetActualMembershipQueryHandler(MembershipService membershipService, IMapper mapper) : IRequestHandler<GetActualMembershipQuery, MembershipWithDetailsDto>
{
    public async Task<MembershipWithDetailsDto?> Handle(GetActualMembershipQuery request,
        CancellationToken cancellationToken)
    {
        return await membershipService.GetActualMembership(request.StyleId, request.ClientId);
    }
}