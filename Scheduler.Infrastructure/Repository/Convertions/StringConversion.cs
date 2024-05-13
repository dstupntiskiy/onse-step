using FluentNHibernate.Conventions;
using FluentNHibernate.Conventions.AcceptanceCriteria;
using FluentNHibernate.Conventions.Inspections;
using FluentNHibernate.Conventions.Instances;

namespace Scheduler.Infrastructure.Repository.Convertions;

public class StringConversion : IUserTypeConvention
{
    public void Accept(IAcceptanceCriteria<IPropertyInspector> criteria) =>
        criteria.Expect(z => z.Property.PropertyType == typeof(string) && z.Length == int.MaxValue);

    public void Apply(IPropertyInstance instance) => instance.CustomSqlType("nvarchar(max");
}