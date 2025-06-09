using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Commands.Groups.DeactivateFinishedGroups;
using Scheduler.Application.Commands.Groups.GroupAddMember;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Queries.Groups;

namespace Scheduler.Controllers;

[ApiController]
[Authorize(Policy = "ActiveUser")]
[Route("api/[controller]")]
public class GroupController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<GroupDto> Get(Guid id)
    {
        return await mediator.Send(new GetGoupQuery(id));
    }
    
    [HttpGet("GetAll")]
    public async Task<GroupDto[]> GetAll(bool onlyActive = false)
    {
        return await mediator.Send(new GetAllGroupQuery(onlyActive));
    }

    [HttpGet("GetById/{id:guid}")]
    public async Task<GroupDto> GetById(Guid id)
    {
        return await mediator.Send(new GetGroupByIdQuery(id));
    }
    
    [HttpGet("GetAllWithDetails")]
    public async Task<List<GroupDetailedDto>> GetAllWithDetails(int take, int skip, bool onlyActive = false)
    {
        return await mediator.Send(new GetAllGroupsWithDetails(take, skip, onlyActive));
    }
    
    [HttpGet("GetGroupWithDetails")]
    public async Task<GroupDetailedDto> GetGroupWithDetails(Guid groupId)
    {
        return await mediator.Send(new GetGroupWithDetailsQuery(groupId));
    }

    [HttpGet("GetGroupMembersCount")]
    public async Task<int> GetGroupMembersCount(Guid groupId)
    {
        return await mediator.Send(new GetGroupMembersCountQuery(groupId));
    }

    [HttpPost]
    public async Task<GroupDto> Add(Application.Commands.Groups.GroupSave.Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [AllowAnonymous]
    [HttpPost("DeactivateFinishedGroups")]
    public async Task<List<Guid>> DeactivateFinishedGroups()
    {
        return await mediator.Send(new DeactivateFinishedGroups());
    }

    [HttpPost("AddClientToGroup")]
    public async Task<GroupMemberDto> AddClientToGroup(Command cmd)
    {
        return await mediator.Send(cmd);
    }

    [HttpDelete("DeleteClientFromGroup")]
    public async Task<IActionResult> DeleteClientFromGroup(Guid groupId, Guid clientId)
    {
        var cmd = new Application.Commands.Groups.GroupRemoveMember.Command(groupId, clientId);
        await mediator.Send(cmd);
        return this.Ok();
    }

    [HttpGet("GetGroupMembers")]
    public async Task<List<GroupMemberDto>> GetGroupMembers(Guid groupId)
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