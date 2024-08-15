using AutoMapper;
using AutoMapper.Execution;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Services;

namespace Scheduler.Application.Queries.Groups;

public class GetGroupMembersQueryHandler(
    IMapper mapper,
    MembershipService membershipService,
    IRepository<Group> groupRepository,
    IRepository<Membership> membershipRepository,
    IRepository<GroupMemberLink> groupMembersRepository) : IRequestHandler<GetGroupMembersQuery, List<GroupMemberDto>>
{
    public async Task<List<GroupMemberDto>> Handle(GetGroupMembersQuery request, CancellationToken cancellationToken)
    {
       var groupMembers = mapper.Map<List<GroupMemberDto>>(groupMembersRepository.Query()
           .Where(x => x.Group.Id == request.GroupId)
           .ToList());

       foreach (var member in groupMembers)
       {
           member.Membership = await membershipService.GetActualMembership(member.Group.Style.Id, member.Member.Id);
       }

       return groupMembers;
    }
}