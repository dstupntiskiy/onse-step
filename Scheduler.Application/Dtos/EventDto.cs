using Scheduler.Entities;
using Scheduler.Entities.Projections;

namespace Scheduler.Application.Common.Dtos;

public class EventDto
{
    public required string Name { get; set; }
    public required DateTime StartDateTime { get; set; }
    public required DateTime EndDateTime { get; set; }
    public string? Color { get; set; }
    public GroupProjection? Group { get; set; }
    
    public Recurrence? Recurrency { get; set; }
}