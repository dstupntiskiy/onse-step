using MediatR;

namespace Scheduler.Application.Commands.Events.EventDelete;

public class Command(Guid id) : IRequest
{
    public Guid Id { get; } = id;
}