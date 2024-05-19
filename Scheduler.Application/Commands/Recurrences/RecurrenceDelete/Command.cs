using MediatR;

namespace Scheduler.Application.Commands.Recurrences.RecurrenceDelete;

public class Command(Guid id) : IRequest
{
    public Guid Id { get; } = id;
}