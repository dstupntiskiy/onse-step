using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Memberships;

public class GetMembershipByIdQueryHandler(IRepository<Membership> membershipRepository,
    IMapper mapper) : IRequestHandler<GetMembershipByIdQuery, MembershipDto>
{
    public async Task<MembershipDto> Handle(GetMembershipByIdQuery request, CancellationToken cancellationToken)
    {
        var membership = await membershipRepository.GetById(request.Id);
        return mapper.Map<MembershipDto>(membership);
    }
}