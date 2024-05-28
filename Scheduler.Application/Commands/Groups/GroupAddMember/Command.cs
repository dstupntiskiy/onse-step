using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Commands.Groups.GroupAddMember;

public class Command(Guid groupId, Guid clientId) : IRequest<GroupMemberDto>
{
    public Guid GroupId { get; } = groupId;
    public Guid ClientId { get; } = clientId;
}