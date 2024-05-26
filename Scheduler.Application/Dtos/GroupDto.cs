namespace Scheduler.Application.Common.Dtos;

public class GroupDto : EntityDto
{
    public string Name { get; init; }
    public string Style { get; init; } = null!;
    
    public virtual DateTime CreateDate { get; set; }
}