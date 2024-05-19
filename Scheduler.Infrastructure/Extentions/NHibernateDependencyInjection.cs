using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using Microsoft.Extensions.DependencyInjection;
using Scheduler.Application.Entities.Base;
using Scheduler.Infrastructure.Repository.Mappings;

namespace Scheduler.Infrastructure.Extentions;

public static class NHibernateDependencyInjection
{
    public static IServiceCollection AddNHibernate(this IServiceCollection services, string connectionSting)
    {
        var factory = CreateConfiguration(connectionSting).BuildSessionFactory();
        return services
            .AddSingleton(factory)
            .AddScoped(_ => factory.OpenSession());
    }

    public static FluentNHibernate.Cfg.FluentConfiguration CreateConfiguration(string connectionString = null) =>
        Fluently
            .Configure()
            .Database(GetPersistentConfigurer(connectionString))
            .Mappings(z => z.FluentMappings
                .AddFromAssemblyOf<AuditableEntityMap<AuditableEntity>>());

    private static IPersistenceConfigurer GetPersistentConfigurer(string connectionString = null)
    {
        var postgreSqlConfiguration = PostgreSQLConfiguration.PostgreSQL82;
        if (connectionString != null)
        {
            postgreSqlConfiguration.ConnectionString(connectionString);
        }

        return postgreSqlConfiguration;
    }
    
}