using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;
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
        optionsBuilder.UseNpgsql(this.Configuration.GetConnectionString("DefaultConnection"));
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
    public DbSet<User> User { get; set; }
    public DbSet<Style> Style { get; set; }
    public DbSet<Membership> Membership { get; set; }
    public DbSet<EventCoachSubstitution> EventCoachSubstitution { get; set; }
}