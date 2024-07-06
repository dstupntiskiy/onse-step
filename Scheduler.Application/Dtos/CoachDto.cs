using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Common.Dtos;

public class CoachDto: BaseEntity
{
    public string Name { get; set; }
    public Style Style { get; set; }
    public bool Active { get; set; }
}