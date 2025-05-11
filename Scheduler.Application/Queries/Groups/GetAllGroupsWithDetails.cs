using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Groups;

public record GetAllGroupsWithDetails(int Take, int Slip, bool OnlyActive) : IRequest<List<GroupDetailedDto>>;
