using MediatR;

namespace Scheduler.Application.Commands.Events.EventParticipantRemove;

public class Command(Guid eventId, Guid clientId) : IRequest
{
    public Guid EventId { get; set; } = eventId;
    public Guid ClientId { get; set; } = clientId;
}
