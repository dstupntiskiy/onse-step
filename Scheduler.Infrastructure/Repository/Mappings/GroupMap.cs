using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class GroupMap : AuditableEntityMap<Group>
{
    public GroupMap()
    {
        Table("\"Group\"");
        
        this.Map(x => x.Name).Column("`Name`");
        this.Map(x => x.Style).Column("`Style`");
        //HasMany(x => x.Members).Inverse().Cascade.All();
    }
}