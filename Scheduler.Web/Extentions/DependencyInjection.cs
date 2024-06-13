using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Base;
using Scheduler.Application.Interfaces;
using Scheduler.Infrastructure.Repository;
using Scheduler.Mappings;

namespace Scheduler.Extentions;

public static class DependencyInjection
{
    private static readonly Assembly ApplicationAssemby = typeof(BaseEntity).Assembly;
    public static IServiceCollection AddRepositories(this IServiceCollection services) =>
        services.AddTransient<IRepository<Recurrence>, Repository<Recurrence>>()
            .AddTransient<IRepository<Group>, Repository<Group>>()
            .AddTransient<IRepository<Event>, Repository<Event>>()
            .AddTransient<IRepository<Client>, Repository<Client>>()
            .AddTransient<IRepository<GroupMemberLink>, Repository<GroupMemberLink>>()
            .AddTransient<IRepository<EventParticipance>, Repository<EventParticipance>>()
            .AddTransient<IRepository<GroupPayment>, Repository<GroupPayment>>()
            .AddTransient<IRepository<OneTimeVisit>, Repository<OneTimeVisit>>()
            .AddTransient<IRepository<OneTimeVisitPayment>, Repository<OneTimeVisitPayment>>();

    public static IServiceCollection AddWebApi(this IServiceCollection services)
    {
        services
            .AddEndpointsApiExplorer()
            .AddSwaggerGen(options => { options.CustomSchemaIds(type => type.FullName?.Replace("+", ".")); })
            .AddControllers(z => z.EnableEndpointRouting = false)
            .AddJsonOptions(option =>
            {
                option.JsonSerializerOptions.IncludeFields = true;
                option.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
            });
        services.AddAutoMapper(typeof(MappingProfile))
            .AddAutoMapper(ApplicationAssemby)
            .AddMediatR(cfg => cfg.RegisterServicesFromAssembly(ApplicationAssemby));

        return services;
    }
}