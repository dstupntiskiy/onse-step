using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Users.RegisterUser;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Queries.Users;
using Scheduler.Application.Services;

namespace Scheduler.Controllers;

[ApiController]
[Authorize(Policy = "ActiveUser")]
[Route("api/[controller]")]
public class UserController(IMediator mediator, UserService userService) : ControllerBase
{
    [HttpPost("RegisterUser")]
    public async Task<IActionResult> RegisterUser(Command cmd)
    {
        await mediator.Send(cmd);
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("Login")]
    public async Task<LoginDto> Login(LoginQuery query)
    {
        return await mediator.Send(query);
    }

    [HttpGet("IsSuperAdminAccess")]
    [Authorize]
    public async Task<bool> IsSuperAdminAccess()
    {
        var userId = User?.FindFirstValue(ClaimTypes.NameIdentifier);
        return await userService.IsSuperAdmin(Guid.Parse(userId ?? string.Empty));
    }
}