using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities;

public class Payment : AuditableEntity
{
    public virtual decimal Amount { get; set; }
    public virtual string? Comment { get; set; }
}