using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class StyleMap : AuditableEntityMap<Style>
{
    public StyleMap()
    {
        Map(x => x.Name).Column("`Name`");
        Map(x => x.BasePrice).Column("`BasePrice`");
        Map(x => x.SecondaryPrice).Column("`SecondaryPrice`");
        Map(x => x.OnetimeVisitPrice).Column("`OnetimeVisitPrice`");
        Map(x => x.BaseSalary).Column("`BaseSalary`");
        Map(x => x.BonusSalary).Column("`BonusSalary`");
    }
}