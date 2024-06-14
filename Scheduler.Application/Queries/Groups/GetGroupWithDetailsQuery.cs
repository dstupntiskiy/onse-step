using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Groups;

public record GetGroupWithDetailsQuery(Guid groupId) : IRequest<GroupDetailedDto>;
