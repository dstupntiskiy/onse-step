using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Groups;

public class GetGroupMembersQueryHandler(
    IMapper mapper,
    IRepository<Group> groupRepository,
    IRepository<GroupMemberLink> groupMembersRepository) : IRequestHandler<GetGroupMembersQuery, List<GroupMemberDto>>
{
    public async Task<List<GroupMemberDto>> Handle(GetGroupMembersQuery request, CancellationToken cancellationToken)
    {
        return mapper.Map<List<GroupMemberDto>>(groupMembersRepository.Query()
            .Where(x => x.Group.Id == request.GroupId).ToList());
    }
}