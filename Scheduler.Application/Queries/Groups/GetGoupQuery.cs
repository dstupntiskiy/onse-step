using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Groups;

public record GetGoupQuery(Guid Id) : IRequest<GroupDto>;
