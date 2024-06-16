using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Users;

public record LoginQuery(string Login, string Password): IRequest<LoginDto>;