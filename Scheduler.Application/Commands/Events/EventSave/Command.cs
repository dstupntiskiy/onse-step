using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Commands.Events.EventSave;

public class Command(
    Guid id,
    string name,
    DateTime startDateTime,
    DateTime endDateTime,
    string? color,
    Guid? groupId,
    Guid? coachId,
    bool isRecurrent,
    Guid? recurrenceId,
    DateTime? recurrencyStartDate,
    DateTime? recurrencyEndDate,
    DateOnly[]? exceptDates,
    DayOfWeek[]? daysOfWeek
    ) : IRequest<List<EventDto>>
{
    public Guid Id { get; } = id;
    public string Name { get; } = name;
    public DateTime StartDateTime { get; } = startDateTime;
    public DateTime EndDateTime { get; } = endDateTime;
    public string? Color { get; } = color;
    public Guid? GroupId { get; } = groupId;
    public Guid? CoachId { get; } = coachId;
    public bool IsRecurrent { get; } = isRecurrent;

    public Guid? RecurrenceId { get; } = recurrenceId;
    public DateTime? RecurrencyStartDate { get; } = recurrencyStartDate;
    public DateTime? RecurrencyEndDate { get; } = recurrencyEndDate;
    public DateOnly[]? ExceptDates { get; } = exceptDates;  
    public DayOfWeek[]? DaysOfWeek { get; } = daysOfWeek;
}

