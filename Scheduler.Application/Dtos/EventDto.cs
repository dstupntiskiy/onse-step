using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Enums;

namespace Scheduler.Application.Common.Dtos;

public class EventDto : EntityDto
{
    public required string Name { get; set; }
    public required DateTime StartDateTime { get; set; }
    public required DateTime EndDateTime { get; set; }
    public string? Color { get; set; }
    public GroupProjection? Group { get; set; }
    public Recurrence? Recurrence { get; set; }
    public CoachProjection? Coach { get; set; }
    public EventType EventType { get; set; }
    public EventCoachSubstitutionDto? EventCoachSubstitution { get; set; }
}