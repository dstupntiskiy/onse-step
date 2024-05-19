using MediatR;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Recurrences.RecurrenceDelete;

namespace Scheduler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecurrenceController(IMediator mediator) : ControllerBase
{
    [HttpDelete]
    public async Task<IActionResult> Delete(Command cmd)
    {
        await mediator.Send(cmd);
        return this.Ok();
    }
}