using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Events;

public class GetEventAttendentsQuery(Guid eventId) : IRequest<List<EventAttendenceDto>>
{
    public Guid EventId { get; set; } = eventId;
}