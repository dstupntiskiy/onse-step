using MediatR;

namespace Scheduler.Application.Queries.Reports.GetMembershipPaymentAmountByDate;

public record GetPaymentsAmountByPeriodQueryQuery(DateTime StartDate, DateTime EndDate) : IRequest<List<KeyValuePair<DateTime, decimal>>>;