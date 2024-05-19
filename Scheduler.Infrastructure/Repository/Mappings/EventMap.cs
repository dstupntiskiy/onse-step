using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class EventMap: AuditableEntityMap<Event>
{
    public EventMap()
    {
        this.Map(x => x.Color);
        this.Map(x => x.Name);
        this.Map(x => x.EndDateTime);
        this.Map(x => x.StartDateTime);
        this.References(x => x.Group)
            .NotFound.Ignore()
            .Column($"{nameof(Group).ToLower()}id");
        this.References(x => x.Recurrence)
            .NotFound.Ignore()
            .Column($"{nameof(Recurrence)}id");
    }    
}