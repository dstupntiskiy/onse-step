using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Queries.Groups;

public class GetGroupQueryHandler(IMapper mapper, IRepository<Group> groupRepository)
    : IRequestHandler<GetGoupQuery, GroupDto>
{
    public async Task<GroupDto> Handle(GetGoupQuery request, CancellationToken cancellationToken)
    {
        return mapper.Map<GroupDto>(await groupRepository.GetById(request.Id));
    }
    
}