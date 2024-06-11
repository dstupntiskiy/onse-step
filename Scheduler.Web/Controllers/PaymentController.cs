using MediatR;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Payments.GroupPaymentSave;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController(IMediator mediator) : ControllerBase
{
    [HttpPost("GroupPaymentSave")]
    public async Task<GroupPaymentDto> GroupPaymentSave(Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(Guid paymentId)
    {
        var cmd = new Application.Commands.Payments.PaymentDelete.Command(paymentId);
        await mediator.Send(cmd);
        return Ok();
    }
}