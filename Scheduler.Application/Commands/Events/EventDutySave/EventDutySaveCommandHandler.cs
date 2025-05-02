using System.ComponentModel.DataAnnotations;
using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Events.EventDutySave;

public class EventDutySaveCommandHandler(IRepository<EventDuty> eventDutyRepository) : IRequestHandler<EventDutySaveCommand, EventDuty>
{
    public async Task<EventDuty> Handle(EventDutySaveCommand request, CancellationToken cancellationToken)
    {
        if (eventDutyRepository.Query().Any(x => ((request.StartDateTime >= x.StartDateTime
            && request.StartDateTime < x.EndDateTime)
            || (request.EndDateTime > x.StartDateTime
                && request.EndDateTime <= x.EndDateTime)) && request.Id != x.Id))
        {
            throw new ValidationException($"Уже существует событие в эти даты");
        }
        var eventDuty = await eventDutyRepository.GetById(request.Id);
        eventDuty = eventDuty == null ? new EventDuty() : eventDuty;
        
        eventDuty.Color = request.Color;
        eventDuty.Name = request.Name;
        eventDuty.StartDateTime = request.StartDateTime;
        eventDuty.EndDateTime = request.EndDateTime;

        return await eventDutyRepository.AddAsync(eventDuty);
    }
}