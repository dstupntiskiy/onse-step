using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Common.Dtos;

public class GroupDto : EntityDto
{
    public string Name { get; init; }
    public string? Style { get; init; }
    
    public bool Active { get; init; }
}