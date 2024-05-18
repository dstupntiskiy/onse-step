using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Events;

public record GetEventQuery(Guid Id): IRequest<EventDto>
{
    
}