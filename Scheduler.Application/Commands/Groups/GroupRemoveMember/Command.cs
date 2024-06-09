using MediatR;

namespace Scheduler.Application.Commands.Groups.GroupRemoveMember;

public class Command(Guid groupId, Guid clientId) : IRequest
{
    public Guid GroupId { get; set; } = groupId;
    public Guid ClientId { get; set; } = clientId;
}