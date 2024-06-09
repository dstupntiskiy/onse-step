using AutoMapper;
using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Events;

public class GetEventParticipantsQueryHandler(
    IMapper mapper,
    IRepository<EventParticipance> eventParticipanceRepository,
    IRepository<Client> clientRepository) : IRequestHandler<GetEventParticipantsCountQuery, List<ClientProjection>>
{
    public async Task<List<ClientProjection>> Handle(GetEventParticipantsCountQuery request,
        CancellationToken cancellationToken)
    {
        return mapper.Map<List<ClientProjection>>(eventParticipanceRepository.Query()
            .Where(x => x.Event.Id == request.EventId)
            .Select(x => x.Client).ToList());
    }
}