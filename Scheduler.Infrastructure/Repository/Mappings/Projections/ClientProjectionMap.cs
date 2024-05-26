using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Infrastructure.Repository.Mappings.Projections;

public class ClientProjectionMap : BaseEntityMap<ClientProjection>
{
    public ClientProjectionMap()
    {
        this.Table(nameof(Client).ToLower());
        this.Map(x => x.Name);
    }
}