using Scheduler.Application.Entities.Base;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class AuditableEntityMap<TEntity> : BaseEntityMap<TEntity>
    where TEntity: AuditableEntity
{
    protected AuditableEntityMap()
    {
        Map(x => x.CreateDate).Column("\"CreateDate\"");
        Map(x => x.CreatedBy).Column("\"CreatedBy\"");
        Map(x => x.ModifiedAt).Column("\"ModifiedAt\"");
        Map(x => x.ModifiedBy).Column("\"ModifiedBy\"");
    }
}