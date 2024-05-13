namespace Scheduler.Application.Common.Dtos;

public abstract class EntityDto
{
    public virtual Guid Id { get; init; }
    public virtual DateTime? CreateDate { get; init; } = null!;
}