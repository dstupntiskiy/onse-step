using MediatR;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Commands.Events.EventDelete;

public class CommandHandler(IRepository<Event> eventRepository, IRepository<Entities.Recurrence> recurrenceRepository): IRequestHandler<Command>
{
    public async Task Handle(Command request, CancellationToken cancellationToken)
    {
        var ev = await eventRepository.GetById(request.Id);
        await eventRepository.DeleteAsync(ev.Id, cancellationToken);
        if (ev.Recurrence != null)
        {
            var recurrence = await recurrenceRepository.GetById(ev.Recurrence.Id);
            var exDates = recurrence.ExceptDates ?? [];
            recurrence.ExceptDates = exDates.Append(DateOnly.FromDateTime(ev.StartDateTime)).ToArray();
            await recurrenceRepository.AddAsync(recurrence);
        }
    }
}