using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Interfaces;
using Scheduler.Entities;

namespace Scheduler.Application.Commands.Events.EventSave;

public class CommandHandler(
    IRepository<Event> eventRepository, 
    IRepository<Recurrence> recurrencyRepository,
    IRepository<Group> groupRepository,
    IMapper mapper)
    : IRequestHandler<Command, EventDto[]>
{
    public async Task<EventDto[]> Handle(Command request, CancellationToken cancellationToken)
    {
        if (request.RecurrencyStartDate != null)
        {
            var ev = new Event()
            {
                Name = request.Name,
                StartDateTime = request.StartDateTime,
                EndDateTime = request.EndDateTime,
                Group = request.GroupId == null ? null : new Group() { Id = request.GroupId.Value},
                Color = request.Color
            };

            var eventId = await eventRepository.AddAsync(ev);
            var createdEvent = new [] {await eventRepository.GetById(eventId)};
            return mapper.Map<EventDto[]>(createdEvent);
        }

        return [];
    }
}
