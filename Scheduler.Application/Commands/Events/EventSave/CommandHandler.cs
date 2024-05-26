using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Entities;
using System.ComponentModel.DataAnnotations;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Commands.Events.EventSave;

public class CommandHandler(
    IRepository<Event> eventRepository, 
    IRepository<Recurrence> recurrencyRepository,
    IRepository<Group> groupRepository,
    IMapper mapper)
    : IRequestHandler<Command, List<EventDto>>
{
    public async Task<List<EventDto>> Handle(Command request, CancellationToken cancellationToken)
    {
        
            List<EventDto> events = new List<EventDto>();
            var group = mapper.Map<Group>(await groupRepository.GetById(request.GroupId ?? Guid.Empty));
            var recurrence = await recurrencyRepository.GetById(request.RecurrenceId ?? Guid.Empty);
            if (!request.IsRecurrent)
            {
                var ev = await this.CreateEvent(request.Id, request.Name, request.StartDateTime, request.EndDateTime, request.Color,
                    recurrence, group: group);
                events.Add(ev);
            }
            else
            {
                if (recurrence == null)
                {
                    events = await this.CreateRecurrentEvents(request, group, cancellationToken);
                }
                else
                {
                    var recurEvents = eventRepository.Query().Where(x => x.Recurrence.Id == recurrence.Id).ToList();
                    foreach (var ev in recurEvents)
                    {
                        var duration = request.EndDateTime - request.StartDateTime;
                        var startTime = ev.StartDateTime.Date + request.StartDateTime.TimeOfDay;
                        var endTime = startTime + duration;
                        if (this.IsOverlap(startTime, endTime, ev.Id))
                        {
                            throw new ValidationException($"В период {startTime} - {endTime} уже существует другое событие");
                        }
                    }
                    foreach (var ev in recurEvents)
                    {
                        var duration = request.EndDateTime - request.StartDateTime;
                        var startTime = ev.StartDateTime.Date + request.StartDateTime.TimeOfDay;
                        var endTime = startTime + duration;
                        var createdEvent = await CreateEvent(ev.Id, request.Name, startTime,
                            endTime, request.Color, recurrence, group);
                        events.Add(createdEvent);
                    }
                }
            }

            return events;
    }

    private async Task<EventDto> CreateEvent(
        Guid id,
        string name,
        DateTime startDateTime,
        DateTime endDateTime,
        string? color,
        Recurrence? recurrence,
        Group? group)
    {
        if (endDateTime < startDateTime)
            throw new ValidationException($"Конец события {endDateTime} меньше, чем начало {startDateTime}");
        
        if (this.IsOverlap(startDateTime, endDateTime, id))
        {
            throw new ValidationException($"В период {startDateTime} - {endDateTime} уже существует другое событие");
        }
        var ev = await eventRepository.GetById(id);
        ev = ev == null ? new Event() : ev; 
        ev.Id = id;
        ev.Name = name;
        ev.StartDateTime = startDateTime;
        ev.EndDateTime = endDateTime;
        ev.Group = group;
        ev.Color = color;
        ev.Recurrence = recurrence;

        var createdEvent = await eventRepository.AddAsync(ev);

        return mapper.Map<EventDto>(createdEvent);
    }

    private bool IsOverlap(DateTime newStart, DateTime newEnd, Guid currentEventId)
    {
        return eventRepository.Query().Any(x =>
            ((newStart <= x.StartDateTime && newEnd > x.StartDateTime)
            || (newStart < x.EndDateTime && newStart >= x.StartDateTime))
            && x.Id != currentEventId);
    }

    private async Task<List<EventDto>> CreateRecurrentEvents(Command request, Group group, CancellationToken cancellationToken)
    {
        List<EventDto> events = new List<EventDto>();
        List<DateTime> eventStartDates = new List<DateTime>();
        
        var currentEventStartTime = request.RecurrencyStartDate.Value.Date.AddDays(1) + request.StartDateTime.TimeOfDay;// need to remove offset
        var duration = request.EndDateTime - request.StartDateTime;

        while (currentEventStartTime <= request.RecurrencyEndDate.Value.AddDays(1))// need to remove offset
        {
            if (Array.Exists(request.DaysOfWeek, day => day == currentEventStartTime.DayOfWeek))
            {
                var currenEventEndTime = currentEventStartTime + duration;
                if (this.IsOverlap(currentEventStartTime, currenEventEndTime, request.Id))
                {
                    throw new ValidationException(
                        $"В период {currentEventStartTime} - {currenEventEndTime} уже существует другое событие");
                }
                eventStartDates.Add(currentEventStartTime);
            }
            
            currentEventStartTime = currentEventStartTime.AddDays(1);
        }
        
        var recurrence = new Recurrence()
            {
                DaysOfWeek = request.DaysOfWeek,
                StartDate = request.RecurrencyStartDate,
                EndDate = request.RecurrencyEndDate,
                ExceptDates = request.ExceptDates
            };
        recurrence = await recurrencyRepository.AddAsync(recurrence);

        foreach (var start in eventStartDates)
        {
            var endDateTime = start + duration;
            var ev = await this.CreateEvent(request.Id, request.Name, start, endDateTime, request.Color,
                recurrence, group);
            events.Add(ev);
        }

        return events;
    }
}
