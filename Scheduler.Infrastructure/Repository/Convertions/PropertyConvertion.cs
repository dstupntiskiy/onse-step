using FluentNHibernate.Conventions;
using FluentNHibernate.Conventions.Instances;

namespace Scheduler.Infrastructure.Repository.Convertions;

public class PropertyConvertion : IPropertyConvention
{
    public void Apply(IPropertyInstance instance) => instance.Column(instance.Name);
}