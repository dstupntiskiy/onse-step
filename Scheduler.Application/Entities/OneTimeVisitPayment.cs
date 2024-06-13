using Scheduler.Application.Entities.Interfaces;

namespace Scheduler.Application.Entities;

public class OneTimeVisitPayment : Payment, IPayment
{
    public virtual OneTimeVisit OneTimeVisit { get; init; }
}