using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Commands.Events.ChangeEventGroup;

public record ChangeEventGroupCommand(Guid EventId, Guid GroupId) : IRequest<List<EventDto>>;
