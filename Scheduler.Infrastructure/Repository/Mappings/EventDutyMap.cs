using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class EventDutyMap : AuditableEntityMap<EventDuty>
{
    public EventDutyMap()
    {
        Map(x => x.Name).Column("`Name`");
        Map(x => x.StartDateTime).Column("`StartDateTime`");
        Map(x => x.EndDateTime).Column("`EndDateTime`");
        Map(x => x.Color).Column("`Color`");
    }
}