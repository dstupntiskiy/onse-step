using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Commands.Coaches.CoachSave;

public record Command(Guid Id, string Name, Guid StyleId) : IRequest<CoachDto>;
