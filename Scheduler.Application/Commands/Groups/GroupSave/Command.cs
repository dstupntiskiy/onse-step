using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Commands.Groups.GroupSave;

public record Command(Guid Id, string Name, Guid StyleId, bool Active, DateTime StartDate, DateTime? EndDate) : IRequest<GroupDto>;
