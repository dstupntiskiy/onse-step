using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Enums;

namespace Scheduler.Application.Commands.Payments.GroupPaymentSave;

public record Command(Guid EntityId, decimal Amount, string? Comment, Guid Id) : IRequest<GroupPaymentDto>;