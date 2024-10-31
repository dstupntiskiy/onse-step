namespace Scheduler.Application.Common.Dtos.Reports;

public class EventWithParticipantsDto
{
    public string Name { get; set; }
    public DateTime StartDate { get; set; }
    public int MembershipsCount { get; set; }
    public int OnetimeVisitsCount { get; set; }
    public int ParticipantsCount { get; set; }
}