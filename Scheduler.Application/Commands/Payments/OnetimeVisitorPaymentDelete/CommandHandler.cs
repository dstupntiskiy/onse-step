using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Payments.OnetimeVisitorPaymentDelete;

public class CommandHandler(IRepository<OneTimeVisitPayment> onetimeVisitPaymentRepository) : IRequestHandler<Command>
{
    public async Task Handle(Command request, CancellationToken cancellationToken)
    {
        await onetimeVisitPaymentRepository.DeleteAsync(request.PaymentId, cancellationToken);
    }
}