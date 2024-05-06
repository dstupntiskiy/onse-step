using Scheduler.Infrastructure.Domain.Base;

namespace Scheduler.Infrastructure.Domain;

public class Group : BaseDomainObject
{
    
    public string Name { get; set; }
    public string Style { get; set; }
}