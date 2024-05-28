using MediatR;

namespace Scheduler.Application.Commands.Groups.GroupRemoveMember;

public class Command(Guid groupMemberLinkId) : IRequest
{
    public Guid GroupMemberLinkId { get; set; } = groupMemberLinkId;
}