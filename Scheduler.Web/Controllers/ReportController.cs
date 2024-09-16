using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Common.Dtos.Reports;
using Scheduler.Application.Queries.Reports.GetMembershipsStylesByPeriod;
using Scheduler.Application.Queries.Reports.GetTotalAmountByPeriod;

namespace Scheduler.Controllers;

[Authorize(Policy = "SuperAdminOnly")]
[ApiController]
[Route("api/[controller]")]
public class ReportController(IMediator mediator) : ControllerBase
{
    [HttpGet("GetMembershipsAmountByPeriod")]
    public async Task<decimal> GetMembershipsAmountByPeriod(DateTime startDate, DateTime endDate)
    {
        return await mediator.Send(new GetTotalAmountByPeriodQuery(startDate, endDate));
    }

    [HttpGet("GetMembershipsStylesByPeriod")]
    public async Task<List<MembershipStyle>> GetMembershipsStylesByPeriod(DateTime startDate, DateTime endDate)
    {
        return await mediator.Send(new GetMembershipsStylesByPeriodQuery(startDate, endDate));
    }
}