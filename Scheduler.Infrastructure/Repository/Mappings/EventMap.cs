using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class EventMap: AuditableEntityMap<Event>
{
    public EventMap()
    {
        this.Map(x => x.Color).Column("`Color`");
        this.Map(x => x.Name).Column("`Name`");
        this.Map(x => x.EndDateTime).Column("`EndDateTime`");
        this.Map(x => x.StartDateTime).Column("`StartDateTime`");
        this.References(x => x.Group).Column("`GroupId`")
            .NotFound.Ignore()
            .Nullable();
        this.References(x => x.Recurrence).Column("`RecurrenceId`")
            .NotFound.Ignore();
    }    
}