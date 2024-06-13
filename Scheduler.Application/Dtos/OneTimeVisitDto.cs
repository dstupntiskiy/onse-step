using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Common.Dtos;

public class OneTimeVisitDto : EntityDto
{
    public ClientProjection Client { get; set; }
    public Guid EventId { get; set; }
    
    public PaymentDto Payment { get; set; }
}