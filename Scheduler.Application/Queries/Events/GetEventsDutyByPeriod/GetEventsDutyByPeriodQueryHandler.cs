using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Events.GetEventsDutyByPeriodQuery;

public class GetEventsDutyByPeriodQueryHandler(IRepository<EventDuty> eventDutyRepository) : IRequestHandler<GetEventsDutyByPeriodQuery, List<EventDuty>>
{
    public async Task<List<EventDuty>> Handle(GetEventsDutyByPeriodQuery request, CancellationToken cancellationToken)
    {
        return eventDutyRepository.Query()
            .Where(x => x.StartDateTime >= request.StartDateTime && x.StartDateTime <= request.EndDateTime).ToList();
    }
}