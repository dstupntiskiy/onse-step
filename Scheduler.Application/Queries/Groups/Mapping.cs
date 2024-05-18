using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Entities;
using Scheduler.Entities.Projections;

namespace Scheduler.Application.Queries.Groups;

public class Mapping : Profile
{
    public Mapping()
    {
        this.CreateMap<Group, GroupDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name))
            .ForMember(x => x.Id, y => y.MapFrom(z => z.Id))
            .ForMember(x => x.Style, y => y.MapFrom(z => z.Style));

        this.CreateMap<GroupProjection, GroupDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name));

        this.CreateMap<Group, GroupProjection>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name));
    }
}