using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class EventCoachSubstitutionMap : AuditableEntityMap<EventCoachSubstitution>
{
    public EventCoachSubstitutionMap()
    {
        References(x => x.Event).Column("`EventId`");
        References(x => x.Coach).Column("`CoachId`");
    }
}