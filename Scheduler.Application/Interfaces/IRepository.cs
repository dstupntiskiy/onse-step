namespace Scheduler.Application.Interfaces;

public interface IRepository<TEntity>
{
    Task<TEntity> GetById(Guid id);
    
    Task<List<TEntity>> GetAll();

    Task AddAsync(TEntity entity);

    Task UpdateAsync(TEntity entity);

    Task Delete(TEntity entity);

    IQueryable<TEntity> Query();
}