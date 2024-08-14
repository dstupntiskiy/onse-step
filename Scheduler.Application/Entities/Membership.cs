using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities;

public class Membership : AuditableEntity
{
    public virtual decimal Amount { get; set; }
    public virtual string? Comment { get; set; }
    public virtual int? VisitsNumber { get; set; }
    public virtual DateTime StartDate { get; set; }
    public virtual DateTime EndDate { get; set; }
    public virtual Client Client { get; set; }
    public virtual Style? Style { get; set; }
    
    public virtual bool Unlimited { get; set; }
}