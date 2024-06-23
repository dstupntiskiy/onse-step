using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Groups;

public record GetAllGroupsWithDetails(bool OnlyActive) : IRequest<List<GroupDetailedDto>>;
