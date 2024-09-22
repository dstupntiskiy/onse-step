using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Mappings;

public class StyleMapping : Profile
{
    public StyleMapping()
    {
        CreateMap<Style, StyleDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name));
    }
}