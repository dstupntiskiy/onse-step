using Scheduler.Application.Entities.Base;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Common.Dtos;

public class EventAttendenceDto
{
    public virtual ClientDto Client { get; set; }
    public virtual bool IsAttendant { get; set; }
    public virtual Guid? GroupMemberId { get; set; }
    
    public virtual MembershipWithDetailsDto? Membership { get; set; }
}