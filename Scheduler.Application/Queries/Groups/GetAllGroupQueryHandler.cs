using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Queries.Groups;

public class GetAllGroupQueryHandler(IMapper mapper, IRepository<Group> groupRepository) : IRequestHandler<GetAllGroupQuery, GroupDto[]>
{

    public async Task<GroupDto[]> Handle(GetAllGroupQuery request, CancellationToken cancellationToken)
    {
        return mapper.Map<GroupDto[]>(groupRepository.Query().Where(x => x.Active == request.OnlyActive || !request.OnlyActive));
    }
}