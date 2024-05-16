using MediatR;

namespace Scheduler.Application.Commands.Groups.GroupSave;

    public class Command(string name, string style) : IRequest<Guid>
    {
        public string Name { get; } = name;
        public string Style { get; } = style;
    }
