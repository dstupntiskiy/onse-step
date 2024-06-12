using Microsoft.EntityFrameworkCore;
using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Contracts;

public interface IOneStepContext
{
    DbSet<Group> Group { get; set; }
    DbSet<Event> Event { get; set; }
    DbSet<Recurrence> Recurrence { get; set; }
    DbSet<Client> Client { get; set; }
    DbSet<GroupMemberLink> GroupMemberLink { get; set; }
    DbSet<EventParticipance> EventParticipance { get; set; }
    DbSet<GroupPayment> GroupPayment { get; set; }
    DbSet<OneTimeVisit> OneTimeVisit { get; set; }
    DbSet<OneTimeVisitPayment> OneTimeVisitPayment { get; set; }
    Task<int> SaveChanges();
}
