using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class OneTimeVisitPaymentMap : PaymentMap<OneTimeVisitPayment>
{
    public OneTimeVisitPaymentMap()
    {
        References(x => x.OneTimeVisit).Column("`OneTimeVisitId`");
    }
}