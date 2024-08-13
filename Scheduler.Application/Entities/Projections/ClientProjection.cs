using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities.Projections;

public class ClientProjection : BaseEntity
{
    public virtual string Name { get; set; }
    public virtual string SocialMediaLink { get; set; }
}