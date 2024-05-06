using System.ComponentModel.DataAnnotations;

namespace Scheduler.Infrastructure.Domain.Base;

public class BaseDomainObject
{
    [Key]
    [Required]
    public Guid Id { get; set; }
    public DateTime CreateDate { get; set; }
}