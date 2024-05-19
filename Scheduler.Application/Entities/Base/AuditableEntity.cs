namespace Scheduler.Application.Entities.Base;

public class AuditableEntity : BaseEntity
{
    public virtual DateTime CreateDate { get; set; }

    public virtual void MarkNew()
    {
        this.CreateDate = DateTime.Now;
    }
}