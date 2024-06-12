using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities;

public class OneTimeVisit : AuditableEntity
{
    public virtual Client Client { get; init; }
    public virtual Event Event { get; init; }
}