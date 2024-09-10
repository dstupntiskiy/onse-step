using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Events.GetEventCoachSubstitution;

public record GetEventCoachSubstitutionQuery(Guid EventId): IRequest<EventCoachSubstitutionDto>;