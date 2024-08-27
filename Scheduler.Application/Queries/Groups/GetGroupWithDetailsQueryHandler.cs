using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Services;

namespace Scheduler.Application.Queries.Groups;

public class GetGroupWithDetailsQueryHandler(IMapper mapper,
    IRepository<Group> groupRepository,
    IRepository<GroupMemberLink> groupMembersRepository,
    MembershipService membershipService) : IRequestHandler<GetGroupWithDetailsQuery, GroupDetailedDto>
{
    public async Task<GroupDetailedDto> Handle(GetGroupWithDetailsQuery request, CancellationToken cancellationToken)
    {
        var group = mapper.Map<GroupDetailedDto>(await groupRepository.GetById(request.groupId));

        var groupsWithMembers = groupMembersRepository.Query().Where(x => x.Group.Id == group.Id).ToList();

        group.MembersCount = groupsWithMembers.Count();
        group.MembershipsCount = Task.WhenAll(groupsWithMembers.Select(async x =>
            await membershipService.GetActualMembership(x.Client.Id, group.Style.Id, group.StartDate, group.EndDate)
        )).Result.Count(x => x is not null);

        return group;
    }
}