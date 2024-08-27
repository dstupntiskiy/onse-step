using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class GroupMap : AuditableEntityMap<Group>
{
    public GroupMap()
    {
        Table("\"Group\"");
        
        Map(x => x.Name).Column("`Name`");
        References(x => x.Style).Column("`StyleId`");
        Map(x => x.Active).Column("`Active`");
        Map(x => x.StartDate).Column("`StartDate`");
        Map(x => x.EndDate).Column("`EndDate`");
    }
}