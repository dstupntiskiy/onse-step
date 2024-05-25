using Scheduler.Application.Entities;

namespace Scheduler.Infrastructure.Repository.Mappings;

public class RecurrencyMap: AuditableEntityMap<Recurrence>
{
    public RecurrencyMap()
    {
        this.Map(x => x.StartDate).Column("`StartDate`");
        this.Map(x => x.EndDate).Column("`EndDate`");
        this.Map(x => x.ExceptDatesJson).Column("`ExceptDatesJson`");
        this.Map(x => x.DaysOfWeekJson).Column("`DaysOfWeekJson`");
    }
}