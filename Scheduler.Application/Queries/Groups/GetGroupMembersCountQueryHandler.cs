using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Groups;

public class GetGroupMembersCountQueryHandler(IRepository<GroupMemberLink> groupMembersRepository) : IRequestHandler<GetGroupMembersCountQuery, int>
{
    public async Task<int> Handle(GetGroupMembersCountQuery reques, CancellationToken cancellationToken)
    {
        return groupMembersRepository.Query().Count(x => x.Group.Id == reques.GroupID);
    }
}