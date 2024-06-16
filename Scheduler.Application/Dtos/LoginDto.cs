namespace Scheduler.Application.Common.Dtos;

public class LoginDto: EntityDto
{
    public string Login { get; set; }
    public string JwtToken { get; set; }
}