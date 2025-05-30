namespace Scheduler.Application.Common.Dtos.Reports;

public class EventDutyReportDto
{
    public required string Name { get; set; }
    
    public double TotalHours { get; set; }
    
    public List<EventDutyDetailDto>?  EventDutyDetails { get; set; }
}

public class EventDutyDetailDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

