using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Commands.Payments.OnetimeVisitorPaymentSave;

public record Command(Guid EntityId, decimal Amount, string? Comment, Guid Id) : IRequest<OnetimePaymentDto>;