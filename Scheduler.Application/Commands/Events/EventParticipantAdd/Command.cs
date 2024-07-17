using MediatR;

namespace Scheduler.Application.Commands.Events.EventParticipantAdd;

public record Command(Guid EventId, Guid ClientId) : IRequest<Guid>;