using Scheduler.Application.Entities;
using Scheduler.Application.Enums;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class EventMap: AuditableEntityMap<Event>
{
    public EventMap()
    {
        Map(x => x.Color).Column("`Color`");
        Map(x => x.Name).Column("`Name`");
        Map(x => x.EndDateTime).Column("`EndDateTime`");
        Map(x => x.StartDateTime).Column("`StartDateTime`");
        References(x => x.Group).Column("`GroupId`")
            .NotFound.Ignore()
            .Nullable();
        References(x => x.Recurrence).Column("`RecurrenceId`")
            .NotFound.Ignore();
        References((x => x.Coach)).Column("`CoachId`")
            .NotFound.Ignore();
        Map(x => x.EventType).CustomType<EventType>().Column("`EventType`");
    }    
}