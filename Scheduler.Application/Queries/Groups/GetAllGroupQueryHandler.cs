using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Interfaces;
using Scheduler.Entities;

namespace Scheduler.Application.Queries.Groups;

public class GetAllGroupQueryHandler() : IRequestHandler<GetAllGroupQuery, GroupDto[]>
{
    private readonly IMapper mapper;
    private readonly IRepository<Group> groupRepository;

    public GetAllGroupQueryHandler(IRepository<Group> groupRepository, IMapper mapper) : this()
    {
        this.mapper = mapper;
        this.groupRepository = groupRepository;
    }

    public async Task<GroupDto[]> Handle(GetAllGroupQuery request, CancellationToken cancellationToken)
    {
        return this.mapper.Map<GroupDto[]>(await this.groupRepository.GetAll());
    }
}