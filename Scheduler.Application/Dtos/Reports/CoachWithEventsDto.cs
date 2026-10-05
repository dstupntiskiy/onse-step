namespace Scheduler.Application.Common.Dtos.Reports;

public class CoachWithEventsDto
{
    public CoachDto Coach { get; set; }

    public int TotalEvents => EventWithParticipants.Count;

    public decimal TotalSalary => EventWithParticipants.Sum(x => x.TotalSalary);
    public List<EventWithParticipantsDto> EventWithParticipants { get; set; }
    
}
