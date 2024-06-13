using MediatR;

namespace Scheduler.Application.Commands.Payments.OnetimeVisitorPaymentDelete;

public record Command(Guid PaymentId): IRequest;