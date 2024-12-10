using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Reports.GetMembershipPaymentAmountByDate;

public class GetPaymentsAmountByDateQueryHandle(
    IRepository<Membership> membershipRepository,
    IRepository<OneTimeVisitPayment> onetimePaymentRepository) : IRequestHandler<GetPaymentsAmountByPeriodQueryQuery, List<KeyValuePair<DateTime, decimal>>> 
{
    public async Task<List<KeyValuePair<DateTime, decimal>>> Handle(GetPaymentsAmountByPeriodQueryQuery request,
        CancellationToken cancellationToken)
    {
        var payments = onetimePaymentRepository.Query()
            .Where(x => x.CreateDate != null && x.CreateDate >= request.StartDate && x.CreateDate <= request.EndDate)
            .Select(x => new { x.CreateDate!.Value.Date, x.Amount }).ToList();
        
        payments.AddRange(membershipRepository.Query()
            .Where(x => x.CreateDate != null && x.CreateDate >= request.StartDate &&
                        x.CreateDate <= request.EndDate)
            .Select(x => new { x.CreateDate!.Value.Date, x.Amount }).ToList());
        
        return payments
            .GroupBy(x => x.Date)
            .Select(x => new KeyValuePair<DateTime, decimal>(x.Key, x.Sum(y => y.Amount)))
            .ToList();
    }
}