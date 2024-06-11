namespace Scheduler.Application.Common.Dtos;

public class GroupPaymentDto : PaymentDto
{
    public Guid GroupMemberId { get; set; }
}