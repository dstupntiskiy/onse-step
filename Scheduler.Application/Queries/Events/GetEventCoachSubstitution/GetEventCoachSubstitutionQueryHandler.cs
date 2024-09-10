using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Events.GetEventCoachSubstitution;

public class GetEventCoachSubstitutionQueryHandler(IRepository<EventCoachSubstitution> eventCoachSubstitutionRepository,
    IMapper mapper) : IRequestHandler<GetEventCoachSubstitutionQuery, EventCoachSubstitutionDto>
{
    public async Task<EventCoachSubstitutionDto> Handle(GetEventCoachSubstitutionQuery request, CancellationToken cancellationToken)
    {
        return mapper.Map<EventCoachSubstitutionDto>(eventCoachSubstitutionRepository.Query()
            .SingleOrDefault(x => x.Event.Id == request.EventId));
    }
}