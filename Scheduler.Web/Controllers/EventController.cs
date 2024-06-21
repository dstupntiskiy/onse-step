using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Events.EventSave;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Queries.Events;

namespace Scheduler.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class EventController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<EventDto> Get(Guid id)
    {
        return await mediator.Send(new GetEventQuery(id));
    }

    [HttpGet("GetEventsByPeriod")]
    public async Task<List<EventDto>> GetEventsByPeriod(DateTime startDate, DateTime endDate)
    {
        return await mediator.Send(new GetEventsByPeriodQuery(startDate, endDate));
    }

    [HttpGet("GetAll")]
    public async Task<EventDto[]> GetAll()
    {
        return await mediator.Send(new GetAllEventsQuery());
    }

    [HttpPost]
    public async Task<List<EventDto>> Save(Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(Guid id)
    {
        var cmd = new Application.Commands.Events.EventDelete.Command(id);
        await mediator.Send(cmd);

        return this.Ok();
    }

    [HttpPost("AddParticipant")]
    public async Task<IActionResult> AddParticipant(Application.Commands.Events.EventParticipantAdd.Command cmd)
    {
        await mediator.Send(cmd);
        return Ok();
    }
    
    [HttpDelete("RemoveParticipant")]
    public async Task<IActionResult> RemoveParticipant(Guid eventId, Guid clientId)
    {
        await mediator.Send(new Application.Commands.Events.EventParticipantRemove.Command(eventId, clientId));
        return Ok();
    }

    [HttpGet("GetParticipantsCount")]
    public async Task<int> GetParticipantsCount(Guid eventId)
    {
        var cmd = new GetEventParticipantsCountQuery(eventId);
        return await mediator.Send(cmd);
    }

    [HttpGet("GetEventAttendies")]
    public async Task<List<EventAttendenceDto>> GetEventAttendies(Guid eventId)
    {
        return await mediator.Send(new GetEventAttendentsQuery(eventId));
    }

    [HttpGet("GetOneTimeVisitors")]
    public async Task<List<OneTimeVisitDto>> GetOneTimeVisitors(Guid eventId)
    {
        return await mediator.Send(new GetOneTimeVisitsQuery(eventId));
    }
    
    [HttpGet("GetOneTimeVisitorsCount")]
    public async Task<int> GetOneTimeVisitorsCount(Guid eventId)
    {
        return await mediator.Send(new GetOneTimeVisitsCountQuery(eventId));
    }

    [HttpPost("SaveOneTimeVisitor")]
    public async Task<OneTimeVisitDto> SaveOneTimeVisitor(Application.Commands.Events.EventOneTimeVisitSave.Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [HttpDelete("RemoveOnetimeVisitor")]
    public async Task<IActionResult> RemoveOnetimeVisitor(Guid visitorId)
    {
        await mediator.Send(new Application.Commands.Events.EventOnetimeVisitorRemove.Command(visitorId));

        return Ok();
    }
}