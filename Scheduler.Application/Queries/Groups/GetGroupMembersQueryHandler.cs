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
    IRepository<GroupMemberLink> groupMembersRepository) : IRequestHandler<GetGroupMembersQuery, GroupMembersDto>
{
    public async Task<GroupMembersDto> Handle(GetGroupMembersQuery request, CancellationToken cancellationToken)
    {
        var result = new GroupMembersDto();
        result.Group = mapper.Map<GroupProjection>(await groupRepository.GetById(request.GroupId));

        result.Members = mapper.Map<List<ClientProjection>>(groupMembersRepository.Query()
            .Where(x => x.Group.Id == request.GroupId).Select(x => x.Client).ToList());

        return result;
    }
}