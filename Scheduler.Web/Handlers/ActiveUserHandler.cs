using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Handlers;

public class ActiveUserHandler(IRepository<User> userRepository, IMemoryCache cache) : AuthorizationHandler<ActiveUserRequirement>
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

        var user = TryGetUser(userIdClaim.Value);
        if (user == null || user.Active == false)
        {
            context.Fail();
            return;
        }
        context.Succeed(requirement);
    }

    private User? TryGetUser(string userId)
    {
        var cacheKey = $"user: {userId}";
        if (cache.TryGetValue(cacheKey, out User? cachedUser))
        {
            return cachedUser;
        }
        
        var user = userRepository.Query().SingleOrDefault(x => x.Id.ToString() == userId);
        if (user != null)
        {
            cache.Set(cacheKey, user, TimeSpan.FromHours(1));
        }
        
        return user;
    }
}