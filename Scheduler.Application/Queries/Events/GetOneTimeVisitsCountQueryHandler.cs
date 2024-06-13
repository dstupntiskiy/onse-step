using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Events;

public class GetOneTimeVisitsCountQueryHandler(IRepository<OneTimeVisit> onetimeVisitRepository) : IRequestHandler<GetOneTimeVisitsCountQuery, int>
{
    public async Task<int> Handle(GetOneTimeVisitsCountQuery request, CancellationToken cancellationToken)
    {
        return onetimeVisitRepository.Query()
            .Count(x => x.Event.Id == request.EventId);
    }
}