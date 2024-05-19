using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        this.CreateMap<Group, GroupDto>();
    }
}