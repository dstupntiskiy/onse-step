using NHibernate;
using NHibernate.Linq;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Entities.Base;

namespace Scheduler.Infrastructure.Repository;

public class Repository<TEntity>(ISession session, ICurrentUserService currentUserService) : IRepository<TEntity>
    where TEntity : AuditableEntity
{
    public IQueryable<TEntity> Query() => session.Query<TEntity>();
    
    public Task<TEntity> GetById(Guid id)
    {
        return session.GetAsync<TEntity>(id);
    }

    public Task<List<TEntity>> GetAll()
    {
        return this.Query().ToListAsync();
    }

    public async Task<TEntity> AddAsync(TEntity entity)
    {
        var now = DateTime.Now;
        var userId = currentUserService.UserId ?? string.Empty;

        if (entity.CreateDate == default)
        {
            entity.MarkNew();
            entity.CreatedBy = userId;
        }

        entity.ModifiedAt = now;
        entity.ModifiedBy = userId;    
            
        using var transaction = session.BeginTransaction();
        try
        {
            if (entity.Id == Guid.Empty)
            {
                await session.SaveAsync(entity);
            }
            else
            {
                await session.SaveOrUpdateAsync(entity);
            }

            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }

        return entity;
    }

    public async Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken)
    {
        var now = DateTime.Now;
        var userId = currentUserService.UserId ?? string.Empty;

        entity.ModifiedAt = now;
        entity.ModifiedBy = userId;   
        
        using var transaction = session.BeginTransaction();
        TEntity mergedEntity;
        try
        {
            mergedEntity = await session.MergeAsync(entity, cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
        return mergedEntity;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        using var transaction = session.BeginTransaction();
        try
        {
            var entity = await this.GetById(id);
            if (entity == null)
            {
                throw new ObjectNotFoundException(id, typeof(TEntity));
            }

            await session.DeleteAsync(entity, cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}