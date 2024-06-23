using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class GroupMap : AuditableEntityMap<Group>
{
    public GroupMap()
    {
        Table("\"Group\"");
        
        Map(x => x.Name).Column("`Name`");
        Map(x => x.Style).Column("`Style`");
        Map(x => x.Active).Column("`Active`");
    }
}