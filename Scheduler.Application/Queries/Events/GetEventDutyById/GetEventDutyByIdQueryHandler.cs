using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Events.GetEventDutyById;

public class GetEventDutyByIdQueryHandler(IRepository<EventDuty> eventDutyRepository) : IRequestHandler<GetEventDutyByIdQuery, EventDuty>
{
    public async Task<EventDuty> Handle(GetEventDutyByIdQuery request, CancellationToken cancellationToken)
    {
        return await eventDutyRepository.GetById(request.Id);
    }
}