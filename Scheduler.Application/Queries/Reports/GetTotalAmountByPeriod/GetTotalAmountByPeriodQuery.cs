using MediatR;

namespace Scheduler.Application.Queries.Reports.GetTotalAmountByPeriod;

public record GetTotalAmountByPeriodQuery(DateTime StartDate, DateTime EndDate) : IRequest<decimal>;