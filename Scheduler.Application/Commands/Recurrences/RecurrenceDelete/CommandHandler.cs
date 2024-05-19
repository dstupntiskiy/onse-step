using MediatR;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Commands.Recurrences.RecurrenceDelete;

public class CommandHandler(IRepository<Event> eventRepository, IRepository<Entities.Recurrence> recurrenceRepository) : IRequestHandler<Command>
{
    public async Task Handle(Command request, CancellationToken cancellationToken)
    {
        var events = eventRepository.Query().Where(x => x.Recurrence.Id == request.Id).ToList();
        foreach (var ev in events)
        {
            await eventRepository.DeleteAsync(ev.Id, cancellationToken);
        }

        await recurrenceRepository.DeleteAsync(request.Id, cancellationToken);
    }
}