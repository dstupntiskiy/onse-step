using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Commands.Groups.GroupSave;

public record Command(Guid Id, string Name, string? Style, bool Active) : IRequest<GroupDto>;
