using Microsoft.EntityFrameworkCore;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Base;
using Scheduler.Infrastructure.Data;
using Scheduler.Infrastructure.Extentions;
using Scheduler.Infrastructure.Repository;
using Scheduler.Mappings;
using Scheduler.Middleware;
using Serilog;

namespace Scheduler;

public class Startup
{
    public IConfiguration Configuration { get; }
    
    public IWebHostEnvironment HostingEnvironment { get; }
    
    public Startup(IConfiguration configuration, IWebHostEnvironment env)
    {
        this.Configuration = configuration;
        this.HostingEnvironment = env;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        var appCore = typeof(BaseEntity).Assembly;
        services.AddLogging(z => z.AddSerilog());
        services.AddDbContext<OneStepContext>(x =>
            x.UseNpgsql(this.Configuration.GetConnectionString("DefaultConnection")));
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.CustomSchemaIds(type => type.FullName?.Replace("+", "."));
        });
        services.AddControllers(z => z.EnableEndpointRouting = false)
            .AddJsonOptions(option => option.JsonSerializerOptions.IncludeFields = true);
        services.AddNHibernate(this.Configuration.GetConnectionString("DefaultConnection"));
        services.AddAutoMapper(typeof(MappingProfile));
        services.AddAutoMapper(appCore);
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(appCore));
        services.AddTransient<IRepository<Recurrence>, Repository<Recurrence>>();
        services.AddTransient<IRepository<Group>, Repository<Group>>();
        services.AddTransient<IRepository<Event>, Repository<Event>>();
        services.AddTransient<IRepository<Client>, Repository<Client>>();
        AppContext.SetSwitch("System.Runtime.Serialization.EnableUnsafeBinaryFormatterSerialization", true);
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseHttpsRedirection()
            .UseMiddleware<ExceptionHanlingMiddleware>()
            .UseRouting()
            .UseEndpoints(z => { z.MapControllers(); })
            .UseHsts()
            .UseSwagger()
            .UseSwaggerUI();
        
    }
}