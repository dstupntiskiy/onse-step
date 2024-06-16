using MediatR;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Users.RegisterUser;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Queries.Users;

namespace Scheduler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IMediator mediator) : ControllerBase
{
    [HttpPost("RegisterUser")]
    public async Task<IActionResult> RegisterUser(Command cmd)
    {
        await mediator.Send(cmd);
        return Ok();
    }

    [HttpPost("Login")]
    public async Task<LoginDto> Login(LoginQuery query)
    {
        return await mediator.Send(query);
    }
}