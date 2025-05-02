using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities;

public class EventDuty : AuditableEntity
{
    public virtual DateTime StartDateTime { get; set; }
    public virtual DateTime EndDateTime { get; set; }
    public virtual string Name { get; set; }
    public virtual string? Color { get; set; }
}