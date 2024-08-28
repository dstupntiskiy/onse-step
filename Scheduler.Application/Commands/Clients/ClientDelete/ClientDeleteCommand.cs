using MediatR;

namespace Scheduler.Application.Commands.Clients.ClientDelete;

public record ClientDeleteCommand(Guid Id) : IRequest<Guid>;
