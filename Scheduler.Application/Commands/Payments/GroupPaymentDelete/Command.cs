using MediatR;
using Scheduler.Application.Enums;

namespace Scheduler.Application.Commands.Payments.PaymentDelete;

public record Command(Guid PaymentId) : IRequest;