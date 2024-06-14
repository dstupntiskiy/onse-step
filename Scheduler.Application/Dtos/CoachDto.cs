using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Common.Dtos;

public class CoachDto: BaseEntity
{
    public string Name { get; set; }
    public string Style { get; set; }
    public bool Active { get; set; }
}