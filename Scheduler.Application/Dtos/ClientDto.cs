namespace Scheduler.Application.Common.Dtos;

public class ClientDto : EntityDto
{
    public required string Name { get; set; }
    public virtual string Phone { get; set; }
    public virtual string SocialMediaLink { get; set; }
    public virtual DateTime CreateDate { get; set; }
}