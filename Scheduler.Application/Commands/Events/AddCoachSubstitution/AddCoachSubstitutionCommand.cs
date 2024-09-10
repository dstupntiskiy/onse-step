using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Commands.Events;

public record AddCoachSubstitutionCommand(Guid EventId, Guid CoachId) : IRequest<EventCoachSubstitutionDto>;