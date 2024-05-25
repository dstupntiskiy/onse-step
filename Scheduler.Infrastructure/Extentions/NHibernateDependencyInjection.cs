using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using Microsoft.Extensions.DependencyInjection;
using NHibernate.Dialect;
using NHibernate.Tool.hbm2ddl;
using Scheduler.Application.Entities.Base;
using Scheduler.Infrastructure.Extentions.Strategies;
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
                .AddFromAssemblyOf<AuditableEntityMap<AuditableEntity>>())
                //.Conventions.Add(FluentNHibernate.Conventions.Helpers.DefaultLazy.Never()))
            .ExposeConfiguration(cfg =>
            {
                cfg.SetNamingStrategy(new PreserveCaseNamingStrategy());
                //new SchemaExport(cfg).Create(false, true);
            });

    private static IPersistenceConfigurer GetPersistentConfigurer(string connectionString = null)
    {
        var postgreSqlConfiguration = PostgreSQLConfiguration.PostgreSQL83;
        if (connectionString != null)
        {
            postgreSqlConfiguration.ConnectionString(connectionString);
        }

        return postgreSqlConfiguration;
    }
    
}