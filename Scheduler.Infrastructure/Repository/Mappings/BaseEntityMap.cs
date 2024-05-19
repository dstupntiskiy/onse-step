using FluentNHibernate.Mapping;
using Scheduler.Application.Entities.Base;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class BaseEntityMap<TEntity>: ClassMap<TEntity>
    where TEntity: BaseEntity
{
    public BaseEntityMap() => this.Id(x => x.Id).GeneratedBy.GuidComb();
}