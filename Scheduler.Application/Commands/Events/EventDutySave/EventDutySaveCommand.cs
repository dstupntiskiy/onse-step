using MediatR;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Commands.Events.EventDutySave;

public record EventDutySaveCommand(
    Guid Id,
    DateTime StartDateTime,
    DateTime EndDateTime,
    string Color,
    string Name) : IRequest<EventDuty>;
