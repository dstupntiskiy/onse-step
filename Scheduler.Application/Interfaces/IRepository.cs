namespace Scheduler.Application.Interfaces;

public interface IRepository<TEntity>
{
    Task<TEntity>? GetById(Guid id);
    
    Task<List<TEntity>> GetAll();

    Task<TEntity> AddAsync(TEntity entity);

    Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken);

    Task DeleteAsync(Guid id, CancellationToken cancellationToken);

    IQueryable<TEntity> Query();
}