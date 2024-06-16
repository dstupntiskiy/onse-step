using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public async Task<List<ClientDto>> GetAll()
    {
        return await mediator.Send(new GetAllClientsQuery());
    }

    [HttpGet("GetAllByQuery")]
    public async Task<List<ClientProjection>> GetAllByQuery(string query)
    {
        return await mediator.Send(new GetClientsByQuery(query));
    }

    [HttpPost]
    public async Task<ClientDto> Add(Command cmd)
    {
        return await mediator.Send(cmd);
    }
}