using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Memberships;

public record GetActualMembershipQuery(Guid ClientId, Guid? StyleId, DateTime? Date) : IRequest<MembershipWithDetailsDto>;