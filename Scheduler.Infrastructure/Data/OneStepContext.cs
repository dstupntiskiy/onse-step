using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Scheduler.Application.Entities;
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
    public DbSet<Recurrence> Recurrence { get; set; }
    public DbSet<Client> Client { get; set; }
    public DbSet<EventParticipance> EventParticipance { get; set; }
    public DbSet<GroupMemberLink> GroupMemberLink { get; set; }
    public DbSet<GroupPayment> GroupPayment { get; set; }
    public DbSet<OneTimeVisit> OneTimeVisit { get; set; }
    public DbSet<OneTimeVisitPayment> OneTimeVisitPayment { get; set; }
    public DbSet<Coach> Coach { get; set; }
}