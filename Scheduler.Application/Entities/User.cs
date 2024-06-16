using Scheduler.Application.Entities.Base;

namespace Scheduler.Application.Entities;

public class User : AuditableEntity
{
    public virtual string Login { get; set; }
    public virtual byte[] PasswordHash { get; set; }
    public virtual byte[] PasswordSalt { get; set; }
}