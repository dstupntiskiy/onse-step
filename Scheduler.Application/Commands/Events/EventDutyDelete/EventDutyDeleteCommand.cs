using MediatR;

namespace Scheduler.Application.Commands.Events.EventDutyDelete;

public record EventDutyDeleteCommand(Guid Id) : IRequest<Guid>;