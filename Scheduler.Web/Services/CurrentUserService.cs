using Scheduler.Application.Interfaces;

namespace Scheduler.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor): ICurrentUserService
{

    public new string? UserId => httpContextAccessor.HttpContext?.User?.FindFirst("name")?.Value;
}