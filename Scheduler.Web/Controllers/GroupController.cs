using MediatR;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Queries.Groups;

namespace Scheduler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroupController : ControllerBase
{
    private readonly IMediator mediator;

    public GroupController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpGet]
    public async Task<GroupDto> Get(Guid id)
    {
        return await this.mediator.Send(new GetGoupQuery(id));
    }
    
    [HttpGet("GetAll")]
    public async Task<GroupDto[]> GetAll()
    {
        return await this.mediator.Send(new GetAllGroupQuery());
    }
    
    //[HttpPost]
    //public async Task<Guid> Create()
}