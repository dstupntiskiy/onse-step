using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Styles.StyleSave;
using Scheduler.Application.Entities;
using Scheduler.Application.Queries.Styles;

namespace Scheduler.Controllers;

[ApiController]
[Authorize(Policy = "ActiveUser")]
[Route("api/[controller]")]
public class StyleController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<Style> Save(Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [HttpGet("GetAll")]
    public async Task<List<Style>> GetAll(bool onlyActive = false)
    {
        var cmd = new GetAllStylesQuery(onlyActive);
        return await mediator.Send(cmd);
    }
}