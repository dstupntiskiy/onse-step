using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities;

public class EventCoachSubstitution : AuditableEntity
{
    public virtual required Event Event { get; set; }
    public virtual required Coach Coach { get; set; }
}