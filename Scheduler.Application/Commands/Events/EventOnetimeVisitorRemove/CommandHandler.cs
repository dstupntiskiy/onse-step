using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Events.EventOnetimeVisitorRemove;

public class CommandHandler(IRepository<OneTimeVisit> onetimeVisitRepository): IRequestHandler<Command>
{
    public async Task Handle(Command request, CancellationToken cancellationToken)
    {
        await onetimeVisitRepository.DeleteAsync(request.VisitorId, cancellationToken);
    }
}