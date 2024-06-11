using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class GroupPaymentMap: PaymentMap<GroupPayment>
{
    public GroupPaymentMap()
    {
        References(x => x.GroupMemberLink).Column("`GroupMemberLinkId`");
    }
}