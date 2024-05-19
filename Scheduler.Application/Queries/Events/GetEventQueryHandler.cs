using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Queries.Events;

public class GetEventQueryHandler(IMapper mapper, IRepository<Event> eventReporsitory)
    : IRequestHandler<GetEventQuery, EventDto>
{
    public async Task<EventDto> Handle(GetEventQuery request, CancellationToken cancellationToken)
    {
        return mapper.Map<EventDto>(await eventReporsitory.GetById(request.Id));
    }
}