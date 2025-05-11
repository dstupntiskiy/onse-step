using System.ComponentModel.DataAnnotations;
using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Groups.DeactivateFinishedGroups;

public record DeactivateFinishedGroups() : IRequest<List<Guid>>;

public class DeactivateFinishedGroupsHandler(IRepository<Group> groupRepository)
    : IRequestHandler<DeactivateFinishedGroups, List<Guid>>
{
    public async Task<List<Guid>> Handle(DeactivateFinishedGroups request, CancellationToken cancellationToken)
    {
        var now = DateTime.Now;
        var groups = groupRepository.Query().Where(x => x.Active && x.EndDate < now).ToArray();

        foreach (var group in groups)
        {
            group.Active = false;
            await groupRepository.AddAsync(group);
        }
        
        return groups.Select(x => x.Id).ToList();
    }
}
