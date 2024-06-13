using Scheduler.Application.Entities.Interfaces;

namespace Scheduler.Application.Entities;

public class GroupPayment : Payment, IPayment
{
    public virtual GroupMemberLink GroupMemberLink { get; set; }
}