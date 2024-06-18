using Microsoft.EntityFrameworkCore;
using Scheduler.Extentions;
using Scheduler.Infrastructure.Data;
using Scheduler.Infrastructure.Extentions;
using Scheduler.Middleware;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;
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
            .AddRepositories()
            .ConfigureAuth(this.Configuration);
        AppContext.SetSwitch("System.Runtime.Serialization.EnableUnsafeBinaryFormatterSerialization", true);
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseStaticFiles()
            .UseSpaStaticFiles();
        app.UseHttpsRedirection()
            .UseMiddleware<ExceptionHanlingMiddleware>()
            .UseRouting()
            .UseAuthentication()
            .UseAuthorization()
            .UseEndpoints(z => { z.MapControllers(); })
            .UseHsts()
            .UseSwagger()
            .UseSwaggerUI();
        
        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "wwwroot";
        });
        
    }
}