using MediatR;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Queries.Events;

public class GetEventParticipantsQuery(Guid eventId) : IRequest<List<ClientProjection>>
{
    public Guid EventId { get; set; } = eventId;
}