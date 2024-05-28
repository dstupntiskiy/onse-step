using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Queries.Groups;

public class GetGroupMembersQuery(Guid groupId) : IRequest<List<GroupMemberDto>>
{
    public Guid GroupId { get; } = groupId;
}