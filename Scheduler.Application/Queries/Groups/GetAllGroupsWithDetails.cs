using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Groups;

public class GetAllGroupsWithDetails : IRequest<List<GroupDetailedDto>>
{
    
}