using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class PaymentMap<TEntity> : AuditableEntityMap<TEntity>
    where TEntity: Payment
{
    public PaymentMap()
    {
        Map(x => x.Amount).Column("`Amount`");
        Map(x => x.Comment).Column("`Comment`");
    }
}