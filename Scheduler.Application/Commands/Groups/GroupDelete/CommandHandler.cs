using MediatR;
using Scheduler.Application.Interfaces;
using Scheduler.Entities;

namespace Scheduler.Application.Commands.Groups.GroupDelete;

    public class CommandHandler(IRepository<Group> groupRepository) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            await groupRepository.DeleteAsync(request.Id, cancellationToken);
        }
    }
