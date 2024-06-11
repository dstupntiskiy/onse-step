using MediatR;

namespace Scheduler.Application.Commands.Payments.PaymentDelete;

public record Command(Guid paymentId) : IRequest;