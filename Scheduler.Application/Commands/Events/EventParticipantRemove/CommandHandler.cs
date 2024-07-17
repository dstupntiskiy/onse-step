using System.ComponentModel.DataAnnotations;
using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Events.EventParticipantRemove;

public class CommandHandler(IRepository<EventParticipance> eventParticipanceRepository) : IRequestHandler<Command,Guid>
{
    public async Task<Guid> Handle(Command request, CancellationToken cancellationToken)
    {
        try
        {
            var participance = eventParticipanceRepository.Query()
                .Single(x => x.Event.Id == request.EventId && x.Client.Id == request.ClientId);

            await eventParticipanceRepository.DeleteAsync(participance.Id, cancellationToken);
            return participance.Id;
        }
        catch (Exception e)
        {
            throw new ValidationException("Не удалось удалить участника", e);
        }
    }
    
}