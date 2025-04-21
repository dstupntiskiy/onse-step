using Scheduler.Application.Entities.Interfaces;

namespace Scheduler.Application.Entities.Base;

public class AuditableEntity : BaseEntity, IAuditableEntity
{
    public virtual DateTime? CreateDate { get; set; }
    public virtual string? CreatedBy { get; set; }
    public virtual string? ModifiedBy { get; set; }
    public virtual DateTime? ModifiedAt { get; set; }

    public virtual void MarkNew()
    {
        this.CreateDate = this.Id == Guid.Empty ? DateTime.Now : this.CreateDate;
    }
}