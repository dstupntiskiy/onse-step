using Scheduler.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class RecurrencyMap: AuditableEntityMap<Recurrence>
{
    public RecurrencyMap()
    {
        this.Map(x => x.StartDate);
        this.Map(x => x.EndDate);
        this.Map(x => x.ExceptDates);
        this.Map(x => x.DaysOfWeek);
    }
}