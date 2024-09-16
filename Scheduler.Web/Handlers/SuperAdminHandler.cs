using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Handlers;

public class SuperAdminHandler(IRepository<User> userRepository) : AuthorizationHandler<SuperAdminRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
        SuperAdminRequirement requirement)
    {
        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return;
        }
        
        var user = userRepository.Query().SingleOrDefault(x => x.Id.ToString() == userIdClaim.Value);
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