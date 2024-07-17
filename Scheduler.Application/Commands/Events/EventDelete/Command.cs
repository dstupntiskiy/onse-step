using MediatR;

namespace Scheduler.Application.Commands.Events.EventDelete;

public class Command(Guid id) : IRequest<Guid>
{
    public Guid Id { get; } = id;
}