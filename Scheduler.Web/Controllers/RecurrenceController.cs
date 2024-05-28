using MediatR;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Recurrences.RecurrenceDelete;

namespace Scheduler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecurrenceController(IMediator mediator) : ControllerBase
{
    [HttpDelete]
    public async Task<List<Guid>> Delete(Guid id)
    {
        var cmd = new Command(id);
        return await mediator.Send(cmd);
    }
}