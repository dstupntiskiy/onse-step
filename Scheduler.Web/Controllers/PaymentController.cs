using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Payments.GroupPaymentSave;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Controllers;

[ApiController]
[Authorize(Policy = "ActiveUser")]
[Route("api/[controller]")]
public class PaymentController(IMediator mediator) : ControllerBase
{
    [HttpPost("GroupPaymentSave")]
    public async Task<GroupPaymentDto> GroupPaymentSave(Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [HttpDelete("GroupPaymentDelete")]
    public async Task<IActionResult> GroupPaymentDelete(Guid paymentId)
    {
        var cmd = new Application.Commands.Payments.PaymentDelete.Command(paymentId);
        await mediator.Send(cmd);
        return Ok();
    }
    
    [HttpPost("OnetimePaymentSave")]
    public async Task<OnetimePaymentDto> OnetimePaymentSave(Application.Commands.Payments.OnetimeVisitorPaymentSave.Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [HttpDelete("OnwetimePaymentDelete")]
    public async Task<IActionResult> OnetimePaymentDelete(Guid paymentId)
    {
        var cmd = new Application.Commands.Payments.OnetimeVisitorPaymentDelete.Command(paymentId);
        await mediator.Send(cmd);
        return Ok();
    }
}