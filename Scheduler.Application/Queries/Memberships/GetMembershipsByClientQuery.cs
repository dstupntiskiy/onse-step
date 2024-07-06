using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Memberships;

public record GetMembershipsByClientQuery(Guid ClientId) : IRequest<List<MembershipWithDetailsDto>>;
