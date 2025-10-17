using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Events;

public class GetEventsByPeriodQueryHandler(IMapper mapper,
    IRepository<Event> eventRepository, IRepository<EventCoachSubstitution> eventSubstitutionRepository) : IRequestHandler<GetEventsByPeriodQuery, List<EventDto>>
{
    public async Task<List<EventDto>> Handle(GetEventsByPeriodQuery request, CancellationToken cancellationToken)
    {
        var events = eventRepository.Query()
            .Where(x => x.StartDateTime >= request.StartDate && x.StartDateTime <= request.EndDate)
            .ToList();

        var eventIds = events.Select(e => e.Id).ToList();

        // Получаем все substitution для этих событий одним запросом
        var substitutions = eventSubstitutionRepository.Query()
            .Where(s => eventIds.Contains(s.Event.Id))
            .ToList();

        // Маппим substitution по id события
        var substitutionByEventId = substitutions
            .ToDictionary(s => s.Event.Id, s => s);

        // Маппим DTO и присоединяем substitution
        var eventDtos = events.Select(e =>
        {
            var dto = mapper.Map<EventDto>(e);

            if (substitutionByEventId.TryGetValue(e.Id, out var substitution))
                dto.EventCoachSubstitution = mapper.Map<EventCoachSubstitutionDto>(substitution);

            return dto;
        }).ToList();

        return eventDtos;
    }
}