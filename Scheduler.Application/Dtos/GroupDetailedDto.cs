namespace Scheduler.Application.Common.Dtos;

public class GroupDetailedDto : GroupDto
{
    public int MembersCount { get; set; }
    
    public int PayedCount { get; set; }
}