using Scheduler.Application.Entities;

namespace Scheduler.Application.Interfaces;

public interface IGroupWriter
{
    Task<Group> SaveNewWithMembers(Group group, IReadOnlyCollection<Client> clients,
        CancellationToken cancellationToken);
}
