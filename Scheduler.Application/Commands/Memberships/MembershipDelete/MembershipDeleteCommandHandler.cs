using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Memberships.MembershipDelete;

public class MembershipDeleteCommandHandler(IRepository<Membership> membershipRepository) : IRequestHandler<MembershipDeleteCommand, Guid>
{
    public async Task<Guid> Handle(MembershipDeleteCommand request, CancellationToken cancellationToken)
    {
        await membershipRepository.DeleteAsync(request.Id, cancellationToken);

        return request.Id;
    }
}