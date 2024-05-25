using Microsoft.EntityFrameworkCore;
using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Contracts;

public interface IOneStepContext
{
    DbSet<Group> Group { get; set; }
    DbSet<Event> Event { get; set; }
    DbSet<Recurrence> Recurrence { get; set; }
    Task<int> SaveChanges();
}