using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class StyleMap : AuditableEntityMap<Style>
{
    public StyleMap()
    {
        Map(x => x.Name).Column("`Name`");
        Map(x => x.BasePrice).Column("`BasePrice`");
    }
}