using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Enums;

namespace Scheduler.Application.Commands.Events.EventSave;

public record Command(
    Guid Id,
    string Name,
    DateTime StartDateTime,
    DateTime EndDateTime,
    string? Color,
    Guid? GroupId,
    Guid? CoachId,
    bool IsRecurrent,
    Guid? RecurrenceId,
    DateTime? RecurrencyStartDate,
    DateTime? RecurrencyEndDate,
    DateOnly[]? ExceptDates,
    DayOfWeek[]? DaysOfWeek,
    EventType EventType
) : IRequest<List<EventDto>>;

