using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class CoachMap : AuditableEntityMap<Coach>
{
    public CoachMap()
    {
        Map(x => x.Name).Column("`Name`");
        Map(x => x.Style).Column("`Style`");
        Map(x => x.Active).Column("`Active`");
    }
}