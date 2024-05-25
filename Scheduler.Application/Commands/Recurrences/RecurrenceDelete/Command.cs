using MediatR;

namespace Scheduler.Application.Commands.Recurrences.RecurrenceDelete;

public class Command(Guid id) : IRequest<List<Guid>>
{
    public Guid Id { get; } = id;
}