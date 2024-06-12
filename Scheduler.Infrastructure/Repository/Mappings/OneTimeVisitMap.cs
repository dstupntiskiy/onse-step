using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class OneTimeVisitMap : AuditableEntityMap<OneTimeVisit>
{
    public OneTimeVisitMap()
    {
        References(x => x.Client).Column("`ClientId`");
        References(x => x.Event).Column("`EventId`");
    }
}