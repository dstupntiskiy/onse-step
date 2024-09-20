using MediatR;
using Scheduler.Application.Common.Dtos.Reports;

namespace Scheduler.Application.Queries.Reports.GetOnetimeVisitsStylesByPeriodQuery;

public record GetOnetimeVisitsStylesByPeriodQuery(DateTime StartDate, DateTime EndDate) : IRequest<List<OnetimeVisitStyle>>;