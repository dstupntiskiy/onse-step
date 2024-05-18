using Scheduler.Entities.Base;

namespace Scheduler.Entities.Projections;

public class GroupProjection: BaseEntity
{
    public virtual string Name { get; set; }
}