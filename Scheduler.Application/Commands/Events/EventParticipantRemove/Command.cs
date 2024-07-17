using MediatR;

namespace Scheduler.Application.Commands.Events.EventParticipantRemove;

public record Command(Guid EventId, Guid ClientId) : IRequest<Guid>;