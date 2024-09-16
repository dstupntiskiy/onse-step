using MediatR;
using Scheduler.Application.Common.Dtos.Reports;

namespace Scheduler.Application.Queries.Reports.GetMembershipsStylesByPeriod;

public record GetMembershipsStylesByPeriodQuery(DateTime StartDate, DateTime EndDate) : IRequest<List<MembershipStyle>>;