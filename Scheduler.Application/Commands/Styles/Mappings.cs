using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Commands.Styles;

public class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<Style, StyleDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name));
    }
}