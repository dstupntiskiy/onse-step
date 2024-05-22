using MediatR;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Events.EventSave;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Queries.Events;

namespace Scheduler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<EventDto> Get(Guid id)
    {
        return await mediator.Send(new GetEventQuery(id));
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
    public async Task<IActionResult> Delete(Application.Commands.Events.EventDelete.Command cmd)
    {
        await mediator.Send(cmd);

        return this.Ok();
    }
}