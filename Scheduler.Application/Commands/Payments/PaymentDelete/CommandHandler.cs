using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Payments.PaymentDelete;

public class CommandHandler(IRepository<GroupPayment> groupPaymentRepository) : IRequestHandler<Command>
{
    public async Task Handle(Command request, CancellationToken cancellationToken)
    {
        await groupPaymentRepository.DeleteAsync(request.paymentId, cancellationToken);
    }
}