using Microsoft.EntityFrameworkCore;
using Scheduler.Infrastructure.Data;

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
            x.UseNpgsql(this.Configuration.GetConnectionString("DefaultConnection")));
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddControllers(z => z.EnableEndpointRouting = false);
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseHttpsRedirection()
            .UseRouting()
            .UseEndpoints(z => { z.MapControllers(); })
            .UseHsts()
            .UseSwagger()
            .UseSwaggerUI();
        
    }
}