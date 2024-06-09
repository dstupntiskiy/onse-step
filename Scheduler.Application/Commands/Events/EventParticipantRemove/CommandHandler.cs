using System.ComponentModel.DataAnnotations;
using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Events.EventParticipantRemove;

public class CommandHandler(IRepository<EventParticipance> eventParticipanceRepository) : IRequestHandler<Command>
{
    public async Task Handle(Command request, CancellationToken cancellationToken)
    {
        try
        {
            var participance = eventParticipanceRepository.Query()
                .Single(x => x.Event.Id == request.EventId && x.Client.Id == request.ClientId);

            eventParticipanceRepository.DeleteAsync(participance.Id, cancellationToken);
        }
        catch (Exception e)
        {
            throw new ValidationException("Не удалось удалить участника", e);
        }
    }
    
}