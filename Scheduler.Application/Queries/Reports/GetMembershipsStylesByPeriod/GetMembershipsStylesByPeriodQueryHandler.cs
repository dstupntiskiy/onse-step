using MediatR;
using Scheduler.Application.Common.Dtos.Reports;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Reports.GetMembershipsStylesByPeriod;

public class GetMembershipsStylesByPeriodQueryHandler(IRepository<Membership> membershipRepository) : IRequestHandler<GetMembershipsStylesByPeriodQuery, List<MembershipStyle>>
{
    public async Task<List<MembershipStyle>> Handle(GetMembershipsStylesByPeriodQuery request,
        CancellationToken cancellationToken)
    {
        return membershipRepository.Query()
            .Where(x => x.StartDate >= request.StartDate && x.StartDate <= request.EndDate).ToList()
            .GroupBy(x =>
            {
                if (x.Style != null) return new { Name = x.Style.Name, Id = x.Style.Id };
                return new { Name = "Безлимит", Id = Guid.Empty };
            })
            .Select(x => new MembershipStyle()
            {
                StyleId = x.Key.Id,
                StyleName = x.Key.Name,
                TotalCount = x.Count(),
                TotalAmount = x.Sum(y => y.Amount)
            }).ToList();
    }
}