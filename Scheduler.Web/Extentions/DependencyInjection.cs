using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Base;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Services;
using Scheduler.Handlers;
using Scheduler.Infrastructure.Data;
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
            .AddTransient<IRepository<OneTimeVisitPayment>, Repository<OneTimeVisitPayment>>()
            .AddTransient<IRepository<User>, Repository<User>>()
            .AddTransient<IRepository<Coach>, Repository<Coach>>()
            .AddTransient<IRepository<Membership>, Repository<Membership>>()
            .AddTransient<IRepository<Style>, Repository<Style>>()
            .AddTransient<IRepository<EventCoachSubstitution>, Repository<EventCoachSubstitution>>()
            .AddTransient<DatabaseInitializer>()
            .AddScoped<MembershipService>()
            .AddTransient<IAuthorizationHandler, SuperAdminHandler>();

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
        services.AddSpaStaticFiles(cfg =>
        {
            cfg.RootPath = "wwwroot";
        });

        services.AddSwaggerGen(opt =>
        {
            opt.SwaggerDoc("v1", new OpenApiInfo() { Title = "MyAPI", Version = "v1" });
            opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "bearer"
            });

            opt.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
            });
        });

        return services;
    }
}