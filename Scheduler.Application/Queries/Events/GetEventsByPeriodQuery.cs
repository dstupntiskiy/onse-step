using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Events;

public record GetEventsByPeriodQuery(DateTime StartDate, DateTime EndDate) : IRequest<List<EventDto>>;