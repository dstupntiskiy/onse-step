using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Clients.ClientDelete;
using Scheduler.Application.Commands.Clients.ClientSave;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Queries.Clients;

namespace Scheduler.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ClientController(IMediator mediator) : ControllerBase
{
    [HttpGet("GetAll")]
    public async Task<List<ClientDto>> GetAll(int take, int skip)
    {
        return await mediator.Send(new GetAllClientsQuery(take, skip));
    }

    [HttpGet("GetById/{id:guid}")]
    public async Task<ClientDto> GetById(Guid id)
    {
        return await mediator.Send(new GetClientByIdQuery(id));
    }

    [HttpGet("GetAllByQuery")]
    public async Task<List<ClientDto>> GetAllByQuery(string query)
    {
        return await mediator.Send(new GetClientsByQuery(query));
    }

    [HttpGet("GetClientOnetimeVisits/{id:guid}")]
    public async Task<List<OnetimeVisitSimpleDto>> GetClientOnetimeVisits(Guid id)
    {
        return await mediator.Send(new GetClientOnetimeVisitsQuery(id));
    }

    [HttpPost]
    public async Task<ClientDto> Add(Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [HttpDelete("Delete/{id:guid}")]
    public async Task<Guid> Delete(Guid id)
    {
        var cmd = new ClientDeleteCommand(id);
        return await mediator.Send(cmd);
    }
}