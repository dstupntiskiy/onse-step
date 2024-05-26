using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class GroupMemberLinkMap : AuditableEntityMap<GroupMemberLink>
{
    public GroupMemberLinkMap()
    {
        this.References(x => x.Group).Column("`GroupId`")
            .NotFound.Ignore();
        this.References(x => x.Client).Column("`ClientId`")
            .NotFound.Ignore();
    }
}