namespace Scheduler.Application.Common.Dtos.Reports;

public class CoachWithEventsDto
{
    public CoachDto Coach { get; set; }
    public List<EventWithParticipantsDto> EventWithParticipants { get; set; }
    
}