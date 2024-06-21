using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Events;

public class GetEventsByPeriodQueryHandler(IMapper mapper,
    IRepository<Event> eventRepository) : IRequestHandler<GetEventsByPeriodQuery, List<EventDto>>
{
    public async Task<List<EventDto>> Handle(GetEventsByPeriodQuery request, CancellationToken cancellationToken)
    {
        return mapper.Map<List<EventDto>>( eventRepository.Query().Where(x =>
            x.StartDateTime >= request.StartDate
            && x.StartDateTime <= request.EndDate).ToList());
    }
}