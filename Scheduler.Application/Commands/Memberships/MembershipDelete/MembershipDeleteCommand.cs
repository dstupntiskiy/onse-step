using MediatR;

namespace Scheduler.Application.Commands.Memberships.MembershipDelete;

public record MembershipDeleteCommand(Guid Id) : IRequest<Guid>; 
