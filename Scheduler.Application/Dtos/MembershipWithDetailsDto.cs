namespace Scheduler.Application.Common.Dtos;

public class MembershipWithDetailsDto : MembershipDto
{
    public int Visited { get; set; }
    
    public bool Expired { get; set; }
}