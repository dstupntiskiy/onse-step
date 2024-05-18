using Microsoft.EntityFrameworkCore;
using Scheduler.Entities;

namespace Scheduler.Infrastructure.Contracts;

public interface IOneStepContext
{
    DbSet<Group> Group { get; set; }
    DbSet<Event> Event { get; set; }
    DbSet<Recurrence> Recurrency { get; set; }
    Task<int> SaveChanges();
}