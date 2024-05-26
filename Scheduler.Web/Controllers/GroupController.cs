using MediatR;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Groups.GroupAddMember;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Queries.Groups;

namespace Scheduler.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroupController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<GroupDto> Get(Guid id)
    {
        return await mediator.Send(new GetGoupQuery(id));
    }
    
    [HttpGet("GetAll")]
    public async Task<GroupDto[]> GetAll()
    {
        return await mediator.Send(new GetAllGroupQuery());
    }

    [HttpPost]
    public async Task<GroupDto> Add(Application.Commands.Groups.GroupSave.Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [HttpPost("AddClientToGroup")]
    public async Task<ClientProjection> AddClientToGroup(Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [HttpGet("GetGroupMembers")]
    public async Task<GroupMembersDto> GetGroupMembers(Guid groupId)
    {
        return await mediator.Send(new GetGroupMembersQuery(groupId));
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(Application.Commands.Groups.GroupDelete.Command cmd)
    {
        await mediator.Send(cmd);

        return this.Ok();
    }
}