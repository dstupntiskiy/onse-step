using MediatR;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Clients.ClientSave;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Queries.Clients;

namespace Scheduler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientController(IMediator mediator) : ControllerBase
{
    [HttpGet("GetAll")]
    public async Task<List<ClientDto>> GetAll()
    {
        return await mediator.Send(new GetAllClientsQuery());
    }

    [HttpPost]
    public async Task<ClientDto> Add(Command cmd)
    {
        return await mediator.Send(cmd);
    }
}