using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Groups;

public class GetGroupByIdQueryHandler(IRepository<Group> groupRepository,
    IMapper mapper) : IRequestHandler<GetGroupByIdQuery, GroupDto>
{
    public async Task<GroupDto> Handle(GetGroupByIdQuery request, CancellationToken cancellationToken)
    {
        var group = await groupRepository.GetById(request.Id);
        return mapper.Map<GroupDto>(group);
    }
}