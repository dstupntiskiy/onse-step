using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Events;

public class GetOneTimeVisitsQueryHandler(IMapper mapper, IRepository<OneTimeVisit> onetimeVisitRepository) : IRequestHandler<GetOneTimeVisitsQuery, List<OneTimeVisitDto>>
{
    public async Task<List<OneTimeVisitDto>> Handle(GetOneTimeVisitsQuery request, CancellationToken cancellationToken)
    {
        return mapper.Map<List<OneTimeVisitDto>>(onetimeVisitRepository.Query()
            .Where(x => x.Event.Id == request.EventId));
    }
}