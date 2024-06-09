using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class EventParticipanceMap : BaseEntityMap<EventParticipance>
{
    public EventParticipanceMap()
    {
        this.References(x => x.Event).Column("`EventId`");
        this.References(x => x.Client).Column("`ClientId`");
    }
    
}