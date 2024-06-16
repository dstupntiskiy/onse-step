using MediatR;

namespace Scheduler.Application.Commands.Users.RegisterUser;

public record Command(string Login, string Password) : IRequest;
