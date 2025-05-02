using MediatR;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Queries.Events.GetEventDutyById;

public record GetEventDutyByIdQuery(Guid Id): IRequest<EventDuty>;