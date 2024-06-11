using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class GroupMemberLinkMap : AuditableEntityMap<GroupMemberLink>
{
    public GroupMemberLinkMap()
    {
        References(x => x.Group).Column("`GroupId`")
            .NotFound.Ignore();
        References(x => x.Client).Column("`ClientId`")
            .NotFound.Ignore();
    }
}