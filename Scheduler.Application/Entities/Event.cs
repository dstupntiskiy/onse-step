using Scheduler.Application.Entities.Base;
using Scheduler.Application.Enums;

namespace Scheduler.Application.Entities;

public class Event : AuditableEntity
{
    public virtual DateTime StartDateTime { get; set; }
    public virtual DateTime EndDateTime { get; set; }
    public virtual string Name { get; set; }
    public virtual Group? Group { get; set; }
    public virtual string? Color { get; set; }
    public virtual Recurrence? Recurrence { get; set; }
    public virtual Coach? Coach { get; set; }
    public virtual EventType EventType { get; set; }
}