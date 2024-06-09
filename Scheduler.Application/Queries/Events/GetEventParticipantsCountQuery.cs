using MediatR;

namespace Scheduler.Application.Queries.Events;

public class GetEventParticipantsCountQuery(Guid eventId) : IRequest<int>
{
    public Guid EventId { get; set; } = eventId;
}