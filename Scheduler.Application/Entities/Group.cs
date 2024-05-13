using Scheduler.Entities.Base;

namespace Scheduler.Entities;

public class Group : AuditableEntity
{
    
    public virtual string Name { get; set; }
    public virtual string Style { get; set; }
}