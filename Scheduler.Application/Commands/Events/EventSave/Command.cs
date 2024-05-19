using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Entities;

namespace Scheduler.Application.Commands.Events.EventSave;

public class Command(
    string name,
    DateTime startDateTime,
    DateTime endDateTime,
    string? color,
    Guid? groupId,
    bool isRecurrent,
    DateTime? recurrencyStartDate,
    DateTime? recurrencyEndDate,
    DateOnly[]? exceptDates,
    DayOfWeek[]? daysOfWeek) : IRequest<List<EventDto>>
{
    public string Name { get; } = name;
    public DateTime StartDateTime { get; } = startDateTime;
    public DateTime EndDateTime { get; } = endDateTime;
    public string? Color { get; } = color;
    public Guid? GroupId { get; } = groupId;
    public bool IsRecurrent { get; } = isRecurrent;
    public DateTime? RecurrencyStartDate { get; } = recurrencyStartDate;
    public DateTime? RecurrencyEndDate { get; } = recurrencyEndDate;
    public DateOnly[]? ExceptDates { get; } = exceptDates;  
    public DayOfWeek[]? DaysOfWeek { get; } = daysOfWeek;
}

