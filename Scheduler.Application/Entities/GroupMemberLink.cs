using Scheduler.Application.Entities.Base;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Entities;

public class GroupMemberLink : AuditableEntity
{
    public virtual Group Group { get; set; }
    public virtual Client Client { get; set; }
}