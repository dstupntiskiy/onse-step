using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Scheduler.Infrastructure.Contracts;
using Scheduler.Infrastructure.Domain;

namespace Scheduler.Infrastructure.Data;

public class OneStepContext: DbContext, IOneStepContext
{
    protected readonly IConfiguration Configuration;

    public OneStepContext(DbContextOptions<OneStepContext> options, IConfiguration configuration)
        : base(options)
    {
        Configuration = configuration;
    }
    public OneStepContext() { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=onestep;User ID=postgres;Password=prigovor;");
    }

    public async Task<int> SaveChanges()
    {
        return await base.SaveChangesAsync();
    }
    
    public DbSet<Group> Groups { get; set; }
}