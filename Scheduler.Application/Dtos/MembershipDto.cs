using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Common.Dtos;

public class MembershipDto
{
    public decimal Amount { get; set; }
    public string? Comment { get; set; }
    public int VisitsNumber { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public ClientProjection Client { get; set; }
    public StyleDto Style { get; set; }
}