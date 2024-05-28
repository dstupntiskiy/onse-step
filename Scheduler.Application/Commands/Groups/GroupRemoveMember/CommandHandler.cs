using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Groups.GroupRemoveMember;

public class CommandHandler(IRepository<GroupMemberLink> groupMemberLinkRepository) : IRequestHandler<Command>
{
    public async Task Handle(Command request, CancellationToken cancellationToken)
    {
        await groupMemberLinkRepository.DeleteAsync(request.GroupMemberLinkId, cancellationToken);
    }
}