using Scheduler.Entities.Base;

namespace Scheduler.Entities;

public class Recurrence : AuditableEntity
{
    public virtual required DateTime StartDate { get; set; }
    public virtual required DateTime EndDate { get; set; }
    public virtual required DayOfWeek[] DaysOfWeek { get; set; }
    public virtual DateTime[]? ExceptDates { get; set; }
}