using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Mappings;

public class CoachMapping : Profile
{
    public CoachMapping()
    {
        CreateMap<Coach, CoachDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name))
            .ForMember(x => x.Style, y => y.MapFrom(z => z.Style))
            .ForMember(x => x.Active, y => y.MapFrom(z => z.Active));

        CreateMap<Coach, CoachProjection>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name));

    }
}