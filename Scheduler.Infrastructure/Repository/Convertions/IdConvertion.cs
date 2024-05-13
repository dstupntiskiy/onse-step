using FluentNHibernate.Conventions;
using FluentNHibernate.Conventions.Instances;

namespace Scheduler.Infrastructure.Repository.Convertions;

public class IdConvertion : IIdConvention
{
    public void Apply(IIdentityInstance instance) => instance.Column(instance.Name.ToLower());
}