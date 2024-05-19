using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities.Projections;

public class GroupProjection: BaseEntity
{
    public virtual string Name { get; set; }
}