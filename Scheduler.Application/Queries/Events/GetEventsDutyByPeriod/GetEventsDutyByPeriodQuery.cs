using MediatR;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Queries.Events.GetEventsDutyByPeriodQuery;

public record GetEventsDutyByPeriodQuery(DateTime StartDateTime, DateTime EndDateTime) : IRequest<List<EventDuty>>;