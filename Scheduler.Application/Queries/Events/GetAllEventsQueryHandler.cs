using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Events;

public class GetAllEventsQueryHandler(IMapper mapper, IRepository<Event> eventRepository) : IRequestHandler<GetAllEventsQuery, EventDto[]>
{
    public async Task<EventDto[]> Handle(GetAllEventsQuery request, CancellationToken cancellationToken)
    {
        return mapper.Map<EventDto[]>(await eventRepository.GetAll());
    }
}