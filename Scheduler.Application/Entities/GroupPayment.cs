namespace Scheduler.Application.Entities;

public class GroupPayment : Payment
{
    public virtual GroupMemberLink GroupMemberLink { get; set; }
}