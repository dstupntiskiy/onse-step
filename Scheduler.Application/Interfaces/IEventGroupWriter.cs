using Scheduler.Application.Entities;

namespace Scheduler.Application.Interfaces;

public interface IEventGroupWriter
{
    Task<List<Event>> ChangeGroup(Guid eventId, Guid groupId, CancellationToken cancellationToken);
}
