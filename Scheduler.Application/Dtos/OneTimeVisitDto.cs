namespace Scheduler.Application.Common.Dtos;

public class OneTimeVisitDto : EntityDto
{
    public Guid ClientId { get; set; }
    public Guid EventId { get; set; }
}