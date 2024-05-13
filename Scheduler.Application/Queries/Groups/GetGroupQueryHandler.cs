using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Interfaces;
using Scheduler.Entities;

namespace Scheduler.Application.Queries.Groups;

public class GetGroupQueryHandler : IRequestHandler<GetGoupQuery, GroupDto>
{
    private readonly IMapper mapper;
    private readonly IRepository<Group> groupRepository;
    
    public GetGroupQueryHandler(IMapper mapper, IRepository<Group> groupRepository)
    {
        this.mapper = mapper;
        this.groupRepository = groupRepository;
    }

    public async Task<GroupDto> Handle(GetGoupQuery request, CancellationToken cancellationToken)
    {
        return this.mapper.Map<GroupDto>(await this.groupRepository.GetById(request.Id));
    }
    
}