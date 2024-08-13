using MediatR;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Memberships.MembershipSave;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Queries.Memberships;

namespace Scheduler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembershipController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<MembershipDto> Save(Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [HttpGet("GetById/{id:guid}")]
    public async Task<MembershipDto> GetById(Guid id)
    {
        return await mediator.Send(new GetMembershipByIdQuery(id));
    }

    [HttpGet("GetMebershipsByClient")]
    public async Task<List<MembershipWithDetailsDto>> GetMebershipsByClient(Guid clientId)
    {
        return await mediator.Send(new GetMembershipsByClientQuery(clientId));
    }
}