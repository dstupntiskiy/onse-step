using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Commands.Memberships.MembershipSave;

public record Command(
    Guid Id,
    decimal Amount,
    DateTime StartDate,
    DateTime EndDate,
    int? VisitsNumber,
    Guid ClientId,
    Guid? StyleId,
    string? Comment,
    decimal Discount,
    bool Unlimited = false) : IRequest<MembershipWithDetailsDto>;
