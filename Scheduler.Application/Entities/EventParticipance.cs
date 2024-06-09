using Scheduler.Application.Entities.Base;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Entities;

public class EventParticipance : AuditableEntity
{
    public virtual Client Client { get; set; }
    public virtual Event Event { get; set; }
}