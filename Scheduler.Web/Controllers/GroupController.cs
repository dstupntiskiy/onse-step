using MediatR;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Queries.Groups;

namespace Scheduler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroupController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<GroupDto> Get(Guid id)
    {
        return await mediator.Send(new GetGoupQuery(id));
    }
    
    [HttpGet("GetAll")]
    public async Task<GroupDto[]> GetAll()
    {
        return await mediator.Send(new GetAllGroupQuery());
    }

    [HttpPost]
    public async Task<Guid> Add(Application.Commands.Groups.GroupSave.Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(Application.Commands.Groups.GroupDelete.Command cmd)
    {
        await mediator.Send(cmd);

        return this.Ok();
    }
}