using Scheduler.Entities;
using Scheduler.Entities.Projections;

namespace Scheduler.Infrastructure.Repository.Mappings.Projections;

public class GroupProjectionMap : BaseEntityMap<GroupProjection>
{
    public GroupProjectionMap()
    {
        this.Table(nameof(Group).ToLower());
        this.Map(x => x.Name);
    }
}