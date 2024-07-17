using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Events.EventOnetimeVisitorRemove;

public class CommandHandler(IRepository<OneTimeVisit> onetimeVisitRepository): IRequestHandler<Command,Guid>
{
    public async Task<Guid> Handle(Command request, CancellationToken cancellationToken)
    {
        await onetimeVisitRepository.DeleteAsync(request.VisitorId, cancellationToken);
        return request.VisitorId;
    }
}