using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Coaches.CoachSave;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Queries.Coaches;

namespace Scheduler.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CoachController(IMediator mediator) :ControllerBase
{
    [HttpGet("GetAll")]
    public async Task<List<CoachDto>> GetAll(bool onlyActive = false)
    {
        return await mediator.Send(new GetAllCoachesQuery(onlyActive));
    }

    [HttpPost]
    public async Task<CoachDto> Save(Command cmd)
    {
        return await mediator.Send(cmd);
    }
}