namespace Scheduler.Application.Entities;

public class OneTimeVisitPayment : Payment
{
    public virtual OneTimeVisit OneTimeVisit { get; }
}