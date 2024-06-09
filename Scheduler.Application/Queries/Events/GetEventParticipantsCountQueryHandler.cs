using AutoMapper;
using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Events;

public class GetEventParticipantsCountQueryHandler(
    IRepository<EventParticipance> eventParticipanceRepository,
    IRepository<Client> clientRepository) : IRequestHandler<GetEventParticipantsCountQuery, int>
{
    public async Task<int> Handle(GetEventParticipantsCountQuery request,
        CancellationToken cancellationToken)
    {
        return eventParticipanceRepository.Query()
            .Count(x => x.Event.Id == request.EventId);
    }
}