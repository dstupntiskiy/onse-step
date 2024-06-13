namespace Scheduler.Application.Entities.Interfaces;

public interface IPayment : IAuditableEntity
{
    public decimal Amount { get; set; }
    public string? Comment { get; set; }
    
}