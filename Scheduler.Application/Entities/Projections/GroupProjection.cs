using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities.Projections;

public class GroupProjection: BaseEntity
{
    public virtual string Name { get; set; }
    public virtual StyleDto Style { get; set; }
}