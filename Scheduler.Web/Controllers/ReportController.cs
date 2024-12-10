using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Common.Dtos.Reports;
using Scheduler.Application.Queries.Reports.GetAllCoachesEventsWithParticipants;
using Scheduler.Application.Queries.Reports.GetMembershipPaymentAmountByDate;
using Scheduler.Application.Queries.Reports.GetMembershipsStylesByPeriod;
using Scheduler.Application.Queries.Reports.GetOnetimeVisitsStylesByPeriodQuery;

namespace Scheduler.Controllers;

[Authorize(Policy = "SuperAdminOnly")]
[ApiController]
[Route("api/[controller]")]
public class ReportController(IMediator mediator) : ControllerBase
{
    [HttpGet("GetMembershipsStylesByPeriod")]
    public async Task<List<MembershipStyle>> GetMembershipsStylesByPeriod(DateTime startDate, DateTime endDate)
    {
        return await mediator.Send(new GetMembershipsStylesByPeriodQuery(startDate, endDate));
    }

    [HttpGet("GetOnetimeVisitsStylesByPeriod")]
    public async Task<List<OnetimeVisitStyle>> GetOnetimeVisitsStylesByPeriod(DateTime startDate, DateTime endDate)
    {
        return await mediator.Send(new GetOnetimeVisitsStylesByPeriodQuery(startDate, endDate));
    }

    [HttpGet("GetAllCoachesEventsWithParticipantsByPeriod")]
    public async Task<List<CoachWithEventsDto>> GetAllCoachesEventsWithParticipantsByPeriod(DateTime startDate,
        DateTime endDate)
    {
        return await mediator.Send(new GetAllCoachesEventsWithParticipantsByPeriodQuery(startDate, endDate));
    }

    [HttpGet("GetPaymentsAmountByPeriod")]
    public async Task<List<KeyValuePair<DateTime, decimal>>> GetPaymentsAmountByPeriod(DateTime startDate, DateTime endDate)
    {
        return await mediator.Send(new GetPaymentsAmountByPeriodQueryQuery(startDate, endDate));
    }
}