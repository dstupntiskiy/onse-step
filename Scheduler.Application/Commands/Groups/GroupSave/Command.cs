using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Commands.Groups.GroupSave;

    public class Command(Guid id, string name, string style) : IRequest<GroupDto>
    {
        public Guid Id { get; } = id;
        public string Name { get; } = name;
        public string Style { get; } = style;
    }
