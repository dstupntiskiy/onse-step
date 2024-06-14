using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities;

public class Group : AuditableEntity
{
    
    public virtual string Name { get; set; }
    public virtual string? Style { get; set; }
    
    //public virtual IList<GroupMemberLink> Members { get; set; }

    public Group()
    {
        //Members = new List<GroupMemberLink>();
    }
}