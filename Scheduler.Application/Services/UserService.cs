using Microsoft.Extensions.Caching.Memory;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Services;

public class UserService(IRepository<User> userRepository, IMemoryCache cache)
{
    public async Task<bool> IsSuperAdmin(Guid id)
    {
        var user = await userRepository.GetById(id);

        return user is { IsSuperAdmin: true };
    }

    public async Task<User?> TryGetUser(string id)
    {
        var cacheKey = $"user: {id}";
        if (cache.TryGetValue(cacheKey, out User? cachedUser))
        {
            return cachedUser;
        }
        
        var user = userRepository.Query().SingleOrDefault(x => x.Id.ToString() == id);
        if (user != null)
        {
            cache.Set(cacheKey, user, TimeSpan.FromHours(1));
        }
        
        return user;
    }
}