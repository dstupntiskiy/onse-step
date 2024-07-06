using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class CoachMap : AuditableEntityMap<Coach>
{
    public CoachMap()
    {
        Map(x => x.Name).Column("`Name`");
        References(x => x.Style).Column("`StyleId`")
            .NotFound.Ignore()
            .Nullable();
        Map(x => x.Active).Column("`Active`");
    }
}