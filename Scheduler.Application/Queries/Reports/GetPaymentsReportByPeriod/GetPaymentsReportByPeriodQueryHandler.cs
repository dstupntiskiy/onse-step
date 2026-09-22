using MediatR;
using Scheduler.Application.Common.Dtos.Reports;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Reports.GetPaymentsReportByPeriod;

public class GetPaymentsReportByPeriodQueryHandler(
    IRepository<Membership> membershipRepository,
    IRepository<OneTimeVisitPayment> paymentRepository)
    : IRequestHandler<GetPaymentsReportByPeriodQuery, PaymentsReportDto>
{
    public Task<PaymentsReportDto> Handle(GetPaymentsReportByPeriodQuery request, CancellationToken cancellationToken)
    {
        if (request.EndDate <= request.StartDate)
            throw new ArgumentException("EndDate must be after StartDate.");
        cancellationToken.ThrowIfCancellationRequested();

        // Project related fields in SQL instead of lazy-loading each entity's style.
        // Historical records without CreateDate cannot be assigned to a payment period.
        var memberships = membershipRepository.Query()
            .Where(x => x.CreateDate.HasValue && x.CreateDate >= request.StartDate && x.CreateDate < request.EndDate)
            .Select(x => new
            {
                x.Id, Date = x.CreateDate!.Value, x.Amount,
                StyleId = !x.Unlimited && x.Style != null ? (Guid?)x.Style.Id : null,
                StyleName = !x.Unlimited && x.Style != null ? x.Style.Name : "Безлимит"
            }).ToList();
        cancellationToken.ThrowIfCancellationRequested();
        var payments = paymentRepository.Query()
            .Where(x => x.CreateDate.HasValue && x.CreateDate >= request.StartDate && x.CreateDate < request.EndDate)
            .Select(x => new
            {
                VisitId = x.OneTimeVisit.Id, Date = x.CreateDate!.Value, x.Amount,
                StyleId = x.OneTimeVisit.Event.Group != null ? (Guid?)x.OneTimeVisit.Event.Group.Style.Id : null,
                StyleName = x.OneTimeVisit.Event.Group != null ? x.OneTimeVisit.Event.Group.Style.Name : "Аренда"
            }).ToList();

        var entries = memberships.Select(x => new Entry(x.StyleId?.ToString() ?? "unlimited", x.StyleId,
                x.StyleName, LocalDate(x.Date), x.Amount, true, x.Id))
            .Concat(payments.Select(x => new Entry(x.StyleId?.ToString() ?? "rental", x.StyleId,
                x.StyleName, LocalDate(x.Date), x.Amount, false, x.VisitId))).ToList();

        var byStyle = entries.GroupBy(x => x.Key).Select(group => new PaymentsByStyleDto(
                group.Key, group.First().StyleId, group.First().StyleName,
                group.Where(x => x.IsMembership).Sum(x => x.Amount),
                group.Where(x => !x.IsMembership).Sum(x => x.Amount),
                group.Where(x => x.IsMembership).Select(x => x.ItemId).Distinct().Count(),
                group.Where(x => !x.IsMembership).Select(x => x.ItemId).Distinct().Count()))
            .OrderByDescending(x => x.TotalAmount).ThenBy(x => x.StyleName).ToList();
        var byDate = entries.GroupBy(x => x.Date).Select(group => new PaymentsByDateDto(group.Key,
                group.Where(x => x.IsMembership).Sum(x => x.Amount),
                group.Where(x => !x.IsMembership).Sum(x => x.Amount)))
            .OrderBy(x => x.Date).ToList();

        return Task.FromResult(new PaymentsReportDto(
            byStyle.Sum(x => x.MembershipAmount), byStyle.Sum(x => x.OnetimeAmount),
            byStyle.Sum(x => x.MembershipCount), byStyle.Sum(x => x.OnetimeCount), byStyle, byDate));

        DateOnly LocalDate(DateTime date)
        {
            // NHibernate may materialize timestamp-with-time-zone values as Unspecified.
            var utc = date.Kind == DateTimeKind.Local ? date.ToUniversalTime() : DateTime.SpecifyKind(date, DateTimeKind.Utc);
            return DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(utc, request.TimeZone));
        }
    }

    private record Entry(string Key, Guid? StyleId, string StyleName, DateOnly Date,
        decimal Amount, bool IsMembership, Guid ItemId);
}
