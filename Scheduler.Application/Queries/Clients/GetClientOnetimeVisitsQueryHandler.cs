using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Clients;

public class GetClientOnetimeVisitsQueryHandler(IMapper mapper,
    IRepository<OneTimeVisit> onetimeVisitRepository) : IRequestHandler<GetClientOnetimeVisitsQuery, List<OnetimeVisitSimpleDto>>
{
    public async Task<List<OnetimeVisitSimpleDto>> Handle(GetClientOnetimeVisitsQuery request,
        CancellationToken cancellationToken)
    {
        var visits = onetimeVisitRepository.Query().Where(x => x.Client.Id == request.Id).ToList();

        return mapper.Map<List<OnetimeVisitSimpleDto>>(visits).OrderByDescending(x => x.Date).ToList();
    }
}