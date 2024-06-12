using Microsoft.EntityFrameworkCore;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Base;
using Scheduler.Extentions;
using Scheduler.Infrastructure.Data;
using Scheduler.Infrastructure.Extentions;
using Scheduler.Infrastructure.Repository;
using Scheduler.Mappings;
using Scheduler.Middleware;

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
        services.AddDbContext<OneStepContext>(x =>
                x.UseNpgsql(this.Configuration.GetConnectionString("DefaultConnection")))
            .AddNHibernate(this.Configuration.GetConnectionString("DefaultConnection"))
            .AddWebApi()
            .AddRepositories();
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