namespace Scheduler.Application.Entities.Interfaces;

public interface IAuditableEntity : IBaseEntity
{
    public DateTime? CreateDate { get; set; }

    public void MarkNew();
}