using MediatR;
using Scheduler.Application.Common.Dtos.Reports;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Reports.GetOnetimeVisitsStylesByPeriodQuery;

public class GetOnetimeVisitsStylesByPeriodQueryHandler(IRepository<OneTimeVisit> onetimeVisitRepository,
    IRepository<OneTimeVisitPayment> onetimeVisitPaymentRepository): IRequestHandler<GetOnetimeVisitsStylesByPeriodQuery, List<OnetimeVisitStyle>>
{
    public async Task<List<OnetimeVisitStyle>> Handle(GetOnetimeVisitsStylesByPeriodQuery request,
        CancellationToken cancellationToken)
    {
        return onetimeVisitPaymentRepository.Query().Where(x =>
                x.OneTimeVisit.Event.StartDateTime >= request.StartDate
                && x.OneTimeVisit.Event.StartDateTime <= request.EndDate)
            .ToList()
            .GroupBy(x =>
            {
                if (x.OneTimeVisit.Event.Group == null)
                    return new { Name = "Аренда", Id = Guid.Empty };
                return new { Name = x.OneTimeVisit.Event.Group.Style.Name, Id = x.OneTimeVisit.Event.Group.Style.Id };
            }).Select(x => new OnetimeVisitStyle()
            {
                StyleId = x.Key.Id,
                StyleName = x.Key.Name,
                TotalCount = x.Count(),
                TotalAmount = x.Sum(y => y.Amount)
            }).ToList();
    }
}