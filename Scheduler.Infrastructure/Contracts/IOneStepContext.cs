using Microsoft.EntityFrameworkCore;
using Scheduler.Infrastructure.Domain;

namespace Scheduler.Infrastructure.Contracts;

public interface IOneStepContext
{
    DbSet<Group> Groups { get; set; }
    Task<int> SaveChanges();
}