using MediatR;

namespace Scheduler.Application.Queries.Groups;

public class GetGroupMembersCountQuery(Guid groupId): IRequest<int>
{
    public Guid GroupID { get; set; } = groupId;
}