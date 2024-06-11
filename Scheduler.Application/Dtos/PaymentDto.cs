using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Common.Dtos;

public class PaymentDto : EntityDto
{
    public decimal Amount { get; set; }
    public string Comment { get; set; }
}