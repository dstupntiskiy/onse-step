using System.ComponentModel.DataAnnotations;

namespace Scheduler.Application.Entities.Base;

public abstract class BaseEntity
{
    [Key]
    [Required]
    public virtual Guid Id { get; set; }
    
}