using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Commands.Events.EventSave;

public class Command(
    string name,
    DateTime startDateTime,
    DateTime endDateTime,
    string? color,
    Guid? groupId,
    DateOnly? recurrencyStartDate,
    DateOnly? recurrencyEndDate,
    DateOnly[]? exceptDates,
    DayOfWeek[]? daysOfWeek) : IRequest<EventDto[]>
{
    public string Name { get; } = name;
    public DateTime StartDateTime { get; } = startDateTime;
    public DateTime EndDateTime { get; } = endDateTime;
    public string? Color { get; } = color;
    public Guid? GroupId { get; } = groupId;
    public DateOnly? RecurrencyStartDate { get; } = recurrencyStartDate;
    public DateOnly? RecurrencyEndDate { get; } = recurrencyEndDate;
    public DateOnly[]? ExceptDays { get; } = exceptDates;
    public DayOfWeek[]? DaysOfWeek { get; } = daysOfWeek;
}

