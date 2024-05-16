using Microsoft.Extensions.Configuration;
using NHibernate;
using NHibernate.Linq;
using Scheduler.Application.Interfaces;
using Scheduler.Entities.Base;

namespace Scheduler.Infrastructure.Repository;

public class Repository<TEntity> : IRepository<TEntity>
    where TEntity: AuditableEntity
{
    private readonly IConfiguration Configuration;
    private readonly ISession Session;
    
    public Repository(IConfiguration configuration, ISession session)
    {
        this.Configuration = configuration;
        this.Session = session;
    }

    public IQueryable<TEntity> Query() => this.Session.Query<TEntity>();
    
    public Task<TEntity> GetById(Guid id)
    {
        return this.Session.GetAsync<TEntity>(id);
    }

    public Task<List<TEntity>> GetAll()
    {
        return this.Query().ToListAsync();
    }

    public async Task<Guid> AddAsync(TEntity entity)
    {
        entity.MarkNew();
        using var transaction = this.Session.BeginTransaction();
        try
        {
            if (entity.Id == Guid.Empty)
            {
                await this.Session.SaveAsync(entity);
            }
            else
            {
                await this.Session.SaveAsync(entity, entity.Id);
            }

            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }

        return entity.Id;
    }

    public Task UpdateAsync(TEntity entity)
    {
        throw new NotImplementedException();
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        using var transaction = this.Session.BeginTransaction();
        try
        {
            var entity = await this.GetById(id);
            if (entity == null)
            {
                throw new ObjectNotFoundException(id, typeof(TEntity));
            }

            await this.Session.DeleteAsync(entity, cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}