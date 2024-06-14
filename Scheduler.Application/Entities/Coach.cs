using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities;

public class Coach: AuditableEntity
{
    public virtual string Name{ get; set; }
    public virtual string? Style { get; set; }
    public virtual bool Active { get; set; }
}