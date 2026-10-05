using NHibernate;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Base;
using Scheduler.Application.Interfaces;

namespace Scheduler.Infrastructure.Repository;

// The group and its draft participants must either all be created or all be rolled back.
public class GroupWriter(ISession session, ICurrentUserService currentUserService) : IGroupWriter
{
    public async Task<Group> SaveNewWithMembers(Group group, IReadOnlyCollection<Client> clients,
        CancellationToken cancellationToken)
    {
        if (group.Id != Guid.Empty)
            throw new ArgumentException("Only new groups can be saved with draft members.", nameof(group));

        using var transaction = session.BeginTransaction();
        try
        {
            MarkCreated(group);
            await session.SaveAsync(group, cancellationToken);
            foreach (var client in clients)
            {
                var link = new GroupMemberLink { Group = group, Client = client };
                MarkCreated(link);
                await session.SaveAsync(link, cancellationToken);
            }

            await transaction.CommitAsync(cancellationToken);
            return group;
        }
        catch
        {
            await transaction.RollbackAsync(CancellationToken.None);
            throw;
        }
    }

    private void MarkCreated(AuditableEntity entity)
    {
        entity.MarkNew();
        entity.CreatedBy = currentUserService.UserId ?? string.Empty;
        entity.ModifiedBy = entity.CreatedBy;
        entity.ModifiedAt = entity.CreateDate;
    }
}
