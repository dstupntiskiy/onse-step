using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Common.Dtos;

public class GroupMembersDto
{
    public GroupProjection Group { get; set; }
    public List<ClientProjection> Members { get; set; }
}