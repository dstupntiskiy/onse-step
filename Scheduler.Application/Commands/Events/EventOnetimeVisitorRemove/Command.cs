using MediatR;

namespace Scheduler.Application.Commands.Events.EventOnetimeVisitorRemove;

public record Command(Guid VisitorId): IRequest;