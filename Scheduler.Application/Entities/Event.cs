using Scheduler.Entities.Base;

namespace Scheduler.Entities;

public class Event : AuditableEntity
{
    public virtual required DateTime StartDateTime { get; set; }
    public virtual required DateTime EndDateTime { get; set; }
    public virtual required string Name { get; set; }
    public virtual Group? Group { get; set; }
    public virtual string? Color { get; set; }
    public virtual Recurrence? Recurrence { get; set; }
}