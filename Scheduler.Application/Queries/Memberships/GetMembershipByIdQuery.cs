using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Memberships;

public record GetMembershipByIdQuery(Guid Id) : IRequest<MembershipDto>;