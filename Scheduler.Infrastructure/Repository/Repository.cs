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

    public Task AddAsync(TEntity entity)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(TEntity entity)
    {
        throw new NotImplementedException();
    }

    public Task Delete(TEntity entity)
    {
        throw new NotImplementedException();
    }
}