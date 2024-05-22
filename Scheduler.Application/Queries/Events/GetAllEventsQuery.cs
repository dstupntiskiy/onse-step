using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Events;

public class GetAllEventsQuery : IRequest<EventDto[]>
{
    
}