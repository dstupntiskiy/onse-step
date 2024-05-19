using Scheduler.Application.Entities.Base;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class AuditableEntityMap<TEntity> : BaseEntityMap<TEntity>
    where TEntity: AuditableEntity
{
    protected AuditableEntityMap()
    {
        this.Map(x => x.CreateDate);
    }
}