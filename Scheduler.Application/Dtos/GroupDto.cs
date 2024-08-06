using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Common.Dtos;

public class GroupDto : EntityDto
{
    public string Name { get; init; }
    public Style Style { get; init; }
    
    public bool Active { get; init; }
}