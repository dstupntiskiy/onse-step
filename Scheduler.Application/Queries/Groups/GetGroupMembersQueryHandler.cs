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
        var group = await groupRepository.GetById(request.GroupId);

       
       var groupMembers = groupMembersRepository.Query()
           .Where(x => x.Group.Id == request.GroupId)
           .Select(member => new 
           {
               Member = member,
               Membership = group.Style == null ? null : membershipService.GetActualMembership(group.Style.Id, member.Client.Id)
           }).ToList();

       var membersWithDetails = groupMembers.Select(x =>
       {
           var member = mapper.Map<GroupMemberDto>(x.Member);
           member.Membership = x.Membership;
           return member;
       }).ToList();

        return membersWithDetails;
    }
}