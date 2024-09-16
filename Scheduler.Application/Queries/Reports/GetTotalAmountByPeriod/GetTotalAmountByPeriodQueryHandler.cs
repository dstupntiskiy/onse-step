using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Reports.GetTotalAmountByPeriod;

public class GetTotalAmountByPeriodQueryHandler(IRepository<Membership> membershipRepository) : IRequestHandler<GetTotalAmountByPeriodQuery, decimal>
{
    public async Task<decimal> Handle(GetTotalAmountByPeriodQuery request, CancellationToken cancellationToken)
    {
        var memberships = membershipRepository.Query()
            .Where(x => x.StartDate >= request.StartDate && x.StartDate <= request.EndDate).ToList();

        return memberships.Sum(x => x.Amount);
    }
}