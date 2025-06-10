using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Scheduler.Application.Services;

namespace Scheduler.Handlers;

public class ActiveUserHandler(UserService userService) : AuthorizationHandler<ActiveUserRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
        ActiveUserRequirement requirement)
    {
        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            context.Fail();
            return;
        }

        var user = await userService.TryGetUser(userIdClaim.Value);
        if (user == null || user.Active == false)
        {
            context.Fail();
            return;
        }
        context.Succeed(requirement);
    }
}