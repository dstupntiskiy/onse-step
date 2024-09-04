using System.ComponentModel.DataAnnotations;
using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Events.EventOnetimeVisitorRemove;

public class CommandHandler(IRepository<OneTimeVisit> onetimeVisitRepository,
    IRepository<OneTimeVisitPayment> onetimeVisitPaymentRepository): IRequestHandler<Command,Guid>
{
    public async Task<Guid> Handle(Command request, CancellationToken cancellationToken)
    {
        if (onetimeVisitPaymentRepository.Query().Any(x => x.OneTimeVisit.Id == request.VisitorId))
        {
            throw new ValidationException("Невозможно удалить посетителя. По нему уже добавлена оплата");
        }
        await onetimeVisitRepository.DeleteAsync(request.VisitorId, cancellationToken);
        return request.VisitorId;
    }
}