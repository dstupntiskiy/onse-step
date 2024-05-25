using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class ClientMap : AuditableEntityMap<Client>
{
    public ClientMap()
    {
        this.Map(x => x.Name).Column("`Name`");
        this.Map(x => x.Phone).Column("`Phone`");
        this.Map(x => x.SocialMediaLink).Column("`SocialMediaLink`");
    }
}