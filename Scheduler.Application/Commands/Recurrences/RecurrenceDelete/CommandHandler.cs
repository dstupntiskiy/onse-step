using MediatR;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Commands.Recurrences.RecurrenceDelete;

public class CommandHandler(IRepository<Event> eventRepository, IRepository<Entities.Recurrence> recurrenceRepository) : IRequestHandler<Command, List<Guid>>
{
    public async Task<List<Guid>> Handle(Command request, CancellationToken cancellationToken)
    {
        var events = eventRepository.Query().Where(x => x.Recurrence.Id == request.Id).ToList();
        var result = events.Select(x => x.Id).ToList();
        foreach (var ev in events)
        {
            await eventRepository.DeleteAsync(ev.Id, cancellationToken);
        }

        await recurrenceRepository.DeleteAsync(request.Id, cancellationToken);
        return result;
    }
}