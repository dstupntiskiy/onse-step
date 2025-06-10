using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Scheduler.Application.Services;

namespace Scheduler.Handlers;

public class SuperAdminHandler(UserService userService) : AuthorizationHandler<SuperAdminRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
        SuperAdminRequirement requirement)
    {
        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return;
        }
        
        var user = await userService.TryGetUser(userIdClaim.Value);
        if (user == null)
        {
            return;
        }

        if (user.IsSuperAdmin)
        {
            context.Succeed(requirement);
        }
    }
}