using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Events;
using Scheduler.Application.Commands.Events.EventSave;
using Scheduler.Application.Commands.Events.RemoveCoachSubstitution;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Queries.Events;
using Scheduler.Application.Queries.Events.GetEventCoachSubstitution;

namespace Scheduler.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class EventController(IMediator mediator) : ControllerBase
{
    [HttpGet("GetEventById/{id:guid}")]
    public async Task<EventDto> GetEventById(Guid id)
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
    public async Task<Guid> Delete(Guid id)
    {
        var cmd = new Application.Commands.Events.EventDelete.Command(id);
        return await mediator.Send(cmd);
    }

    [HttpPost("AddParticipant")]
    public async Task<Guid> AddParticipant(Application.Commands.Events.EventParticipantAdd.Command cmd)
    {
        return await mediator.Send(cmd);
    }
    
    [HttpDelete("RemoveParticipant")]
    public async Task<Guid> RemoveParticipant(Guid eventId, Guid clientId)
    {
        return await mediator.Send(new Application.Commands.Events.EventParticipantRemove.Command(eventId, clientId));
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
    public async Task<Guid> RemoveOnetimeVisitor(Guid visitorId)
    {
        return await mediator.Send(new Application.Commands.Events.EventOnetimeVisitorRemove.Command(visitorId));
    }
    
    [HttpPost("AddCoachSubstitution")]
    public async Task<EventCoachSubstitutionDto> AddCoachSubstitution(AddCoachSubstitutionCommand cmd)
    {
        return await mediator.Send(cmd);
    }
    
    [HttpDelete("RemoveCoachSubstitution")]
    public async Task<Guid> RemoveCoachSubstitution(Guid substitutionId)
    {
        return await mediator.Send(new RemoveCoachSubstitutionCommand(substitutionId));
    }

    [HttpGet("GetCoachSubstitution/{eventId:guid}")]
    public async Task<EventCoachSubstitutionDto> GetCoachSubstitution(Guid eventId)
    {
        return await mediator.Send(new GetEventCoachSubstitutionQuery(eventId));
    }
}