using Scheduler.Application.Entities.Base;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Common.Dtos;

public class GroupMemberDto : AuditableEntity
{
    public GroupProjection Group { get; set; }
    public ClientProjection Member { get; set; }
    
    public PaymentDto? Payment { get; set; }
}