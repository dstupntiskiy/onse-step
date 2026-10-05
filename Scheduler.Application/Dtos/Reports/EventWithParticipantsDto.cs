namespace Scheduler.Application.Common.Dtos.Reports;

public class EventWithParticipantsDto
{
    public string Name { get; set; }
    public DateTime StartDate { get; set; }
    public int OnetimeVisitsCount { get; set; }
    public int ParticipantsCount { get; set; }
    public int MembersCount { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal BonusSalary { get; set; }
    public decimal TotalSalary { get; set; }
}
