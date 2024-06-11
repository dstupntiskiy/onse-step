using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Commands.Payments.GroupPaymentSave;

public record Command(Guid GroupMemberLinkId, decimal Amount, string? Comment, Guid Id) : IRequest<GroupPaymentDto>;