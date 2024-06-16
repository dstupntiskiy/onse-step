using NHibernate.Mapping;
using Scheduler.Application.Entities;
using Index = NHibernate.Mapping.Index;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class UserMapping: AuditableEntityMap<User>
{
    public UserMapping()
    {
        Map(x => x.Login).Column("`Login`");
        Map(x => x.PasswordHash).Column("`PasswordHash`");
        Map(x => x.PasswordSalt).Column("`PasswordSalt`");
    }
}