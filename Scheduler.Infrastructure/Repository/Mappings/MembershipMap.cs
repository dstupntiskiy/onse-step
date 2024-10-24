using NHibernate.Mapping;
using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class MembershipMap : AuditableEntityMap<Membership>
{
    public MembershipMap()
    {
        Map(x => x.Amount).Column("`Amount`");
        Map(x => x.Comment).Column("`Comment`");
        Map(x => x.StartDate).Column("`StartDate`");
        Map(x => x.EndDate).Column("`EndDate`");
        Map(x => x.VisitsNumber).Column("`VisitsNumber`");
        Map(x => x.Unlimited).Column("`Unlimited`");
        Map(x => x.Discount).Column("`Discount`");
        References(x => x.Client).Column("`ClientId`");
        References(x => x.Style).Column("`StyleId`");
    }
}