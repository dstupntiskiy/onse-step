using MediatR;
using Scheduler.Application.Common.Dtos.Reports;

namespace Scheduler.Application.Queries.Reports.GetPaymentsReportByPeriod;

// UTC interval [StartDate, EndDate); TimeZone controls calendar-day grouping.
public record GetPaymentsReportByPeriodQuery(DateTime StartDate, DateTime EndDate, TimeZoneInfo TimeZone)
    : IRequest<PaymentsReportDto>;
