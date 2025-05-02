using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Events.EventDutyDelete;

public class EventDutyDeleteCommandHandler(IRepository<EventDuty> eventDutyRepository) : IRequestHandler<EventDutyDeleteCommand, Guid>
{
    public async Task<Guid> Handle(EventDutyDeleteCommand request, CancellationToken cancellationToken)
    {
        await eventDutyRepository.DeleteAsync(request.Id, cancellationToken);
        return request.Id;
    }
}