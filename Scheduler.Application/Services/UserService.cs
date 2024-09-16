using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Services;

public class UserService(IRepository<User> userRepository)
{
    public async Task<bool> IsSuperAdmin(Guid id)
    {
        var user = await userRepository.GetById(id);

        return user is { IsSuperAdmin: true };
    }
}