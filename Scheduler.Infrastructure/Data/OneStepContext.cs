using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Scheduler.Entities;
using Scheduler.Infrastructure.Contracts;

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
    
    public DbSet<Group> Group { get; set; }
    
    public DbSet<Event> Event { get; set; }
    
    public DbSet<Recurrence> Recurrency { get; set; }
}