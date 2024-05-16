using MediatR;

namespace Scheduler.Application.Commands.Groups.GroupDelete;

    public class Command(Guid id) : IRequest
    {
        public Guid Id { get; } = id;
    }
