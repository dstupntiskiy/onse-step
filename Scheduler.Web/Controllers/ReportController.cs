using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Common.Dtos.Reports;
using Scheduler.Application.Queries.Reports;
using Scheduler.Application.Queries.Reports.GetAllCoachesEventsWithParticipants;
using Scheduler.Application.Queries.Reports.GetPaymentsReportByPeriod;

namespace Scheduler.Controllers;

[Authorize(Policy = "SuperAdminOnly")]
[ApiController]
[Route("api/[controller]")]
public class ReportController(IMediator mediator) : ControllerBase
{
    [HttpGet("GetPaymentsReportByPeriod")]
    public async Task<ActionResult<PaymentsReportDto>> GetPaymentsReportByPeriod(
        DateTimeOffset startDate, DateTimeOffset endDate, string timeZoneId = "Europe/Belgrade",
        CancellationToken cancellationToken = default)
    {
        if (endDate <= startDate)
            return BadRequest(new { message = "Конец периода должен быть позже начала." });

        TimeZoneInfo timeZone;
        try
        {
            timeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
        }
        catch (Exception exception) when (exception is TimeZoneNotFoundException or InvalidTimeZoneException)
        {
            return BadRequest(new { message = "Неизвестный часовой пояс." });
        }

        return await mediator.Send(new GetPaymentsReportByPeriodQuery(
            startDate.UtcDateTime, endDate.UtcDateTime, timeZone), cancellationToken);
    }

    [HttpGet("GetEventDutiesReportByPeriod")]
    public async Task<List<EventDutyReportDto>> GetEventDutiesReportByPeriod(DateTime startDate, DateTime endDate)
    {
        return await mediator.Send(new GetEventDutyByPeriodQuery(startDate, endDate));
    }

    [HttpGet("GetAllCoachesEventsWithParticipantsByPeriod")]
    public async Task<List<CoachWithEventsDto>> GetAllCoachesEventsWithParticipantsByPeriod(DateTime startDate,
        DateTime endDate)
    {
        return await mediator.Send(new GetAllCoachesEventsWithParticipantsByPeriodQuery(startDate, endDate));
    }
}
