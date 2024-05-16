namespace Scheduler.Application.Interfaces;

public interface IRepository<TEntity>
{
    Task<TEntity> GetById(Guid id);
    
    Task<List<TEntity>> GetAll();

    Task<Guid> AddAsync(TEntity entity);

    Task UpdateAsync(TEntity entity);

    Task DeleteAsync(Guid id, CancellationToken cancellationToken);

    IQueryable<TEntity> Query();
}