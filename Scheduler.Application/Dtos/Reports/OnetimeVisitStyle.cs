namespace Scheduler.Application.Common.Dtos.Reports;

public class OnetimeVisitStyle
{
    public decimal TotalCount { get; set; }
    public decimal TotalAmount { get; set; }
    public Guid StyleId { get; set; }
    public string StyleName { get; set; }
}