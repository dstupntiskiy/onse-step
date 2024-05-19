using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Interfaces;
using Scheduler.Entities;
using System;
using System.ComponentModel.DataAnnotations;
using System.Data;

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
            var group = await groupRepository.GetById(request.GroupId ?? Guid.Empty);
            if (!request.IsRecurrent)
            {
                var ev = await this.CreateEvent(request.Name, request.StartDateTime, request.EndDateTime, request.Color,
                    null, group: group);
                events.Add(ev);
            }
            else
            {
                List<DateTime> eventStartDates = new List<DateTime>();
                var currentEventStartTime = request.RecurrencyStartDate.Value.Date + request.StartDateTime.TimeOfDay;
                var duration = request.EndDateTime - request.StartDateTime;

                while (currentEventStartTime <= request.RecurrencyEndDate)
                {
                    if (Array.Exists(request.DaysOfWeek, day => day == currentEventStartTime.DayOfWeek))
                    {
                        var currenEventEndTime = currentEventStartTime + duration;
                        if (this.IsOverlap(currentEventStartTime, currenEventEndTime))
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
                var createdRecurrence = await recurrencyRepository.AddAsync(recurrence);

                foreach (var start in eventStartDates)
                {
                    var endDateTime = start + duration;
                    var ev = await this.CreateEvent(request.Name, start, endDateTime, request.Color,
                        createdRecurrence, group);
                    events.Add(ev);
                }
            }

            return events;
    }

    private async Task<EventDto> CreateEvent(
        string name,
        DateTime startDateTime,
        DateTime endDateTime,
        string? color,
        Recurrence? recurrence,
        Group? group)
    {
        if (endDateTime < startDateTime)
            throw new ValidationException($"Конец события {endDateTime} меньше, чем начало {startDateTime}");
        
        if (this.IsOverlap(startDateTime, endDateTime))
        {
            throw new ValidationException($"В период {startDateTime} - {endDateTime} уже существует другое событие");
        }
        var ev = new Event()
        {
            Name = name,
            StartDateTime = startDateTime,
            EndDateTime = endDateTime,
            Group = group,
            Color = color,
            Recurrence = recurrence
        };
        var createdEvent = await eventRepository.AddAsync(ev);
        return mapper.Map<EventDto>(createdEvent);
    }

    private bool IsOverlap(DateTime newStart, DateTime newEnd)
    {
        return eventRepository.Query().Any(x =>
            (newStart <= x.StartDateTime && newEnd > x.StartDateTime)
            || (newStart < x.EndDateTime && newStart >= x.StartDateTime));
    }
}
