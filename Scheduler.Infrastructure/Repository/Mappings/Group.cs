using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class Group : AuditableEntityMap<Application.Entities.Group>
{
    public Group()
    {
        Table("\"Group\"");
        
        this.Map(x => x.Name).Column("`Name`");
        this.Map(x => x.Style).Column("`Style`");
    }
}