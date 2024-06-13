using System.ComponentModel.DataAnnotations;
using Scheduler.Application.Entities.Interfaces;

namespace Scheduler.Application.Entities.Base;

public abstract class BaseEntity : IBaseEntity
{
    [Key]
    [Required]
    public virtual Guid Id { get; set; }
    
}