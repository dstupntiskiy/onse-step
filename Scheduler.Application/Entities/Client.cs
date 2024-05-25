using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities;

public class Client : AuditableEntity
{
    public virtual string Name { get; set; }
    public virtual string Phone { get; set; }
    public virtual string SocialMediaLink { get; set; }
}