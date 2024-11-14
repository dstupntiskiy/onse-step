using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities;

public class Style : AuditableEntity
{
    public virtual string Name { get; set; }
    public virtual decimal BasePrice { get; set; }
    public virtual decimal SecondaryPrice { get; set; }
    public virtual decimal OnetimeVisitPrice { get; set; }
    public virtual decimal BaseSalary { get; set; }
    public virtual decimal BonusSalary { get; set; }
}