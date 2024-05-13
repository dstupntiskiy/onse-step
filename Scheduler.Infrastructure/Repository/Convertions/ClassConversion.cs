using FluentNHibernate.Conventions;
using FluentNHibernate.Conventions.Instances;

namespace Scheduler.Infrastructure.Repository.Convertions;

public class ClassConversion: IClassConvention
{
    public void Apply(IClassInstance instance) => instance.Table(instance.TableName.ToLower());
}