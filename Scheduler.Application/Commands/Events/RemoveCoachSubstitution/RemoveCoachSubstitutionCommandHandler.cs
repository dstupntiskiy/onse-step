using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Events.RemoveCoachSubstitution;

public class RemoveCoachSubstitutionCommandHandler(IRepository<EventCoachSubstitution> eventCoachSubstitutionRepository) : IRequestHandler<RemoveCoachSubstitutionCommand, Guid>
{
    public async Task<Guid> Handle(RemoveCoachSubstitutionCommand request, CancellationToken cancellationToken)
    {
        await eventCoachSubstitutionRepository.DeleteAsync(request.Id, cancellationToken);

        return request.Id;
    }
}