using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class GroupMap : AuditableEntityMap<Group>
{
    public GroupMap()
    {
        this.Map(x => x.Name);
        this.Map(x => x.Style);
    }
}