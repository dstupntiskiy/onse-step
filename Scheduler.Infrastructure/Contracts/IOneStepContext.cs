using Microsoft.EntityFrameworkCore;
using Scheduler.Entities;

namespace Scheduler.Infrastructure.Contracts;

public interface IOneStepContext
{
    DbSet<Group> Group { get; set; }
    Task<int> SaveChanges();
}