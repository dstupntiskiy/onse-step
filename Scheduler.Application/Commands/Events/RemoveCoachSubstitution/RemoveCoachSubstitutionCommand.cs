using MediatR;

namespace Scheduler.Application.Commands.Events.RemoveCoachSubstitution;

public record RemoveCoachSubstitutionCommand(Guid Id) : IRequest<Guid>;