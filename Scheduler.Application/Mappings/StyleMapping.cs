using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Mappings;

public class StyleMapping : Profile
{
    public StyleMapping()
    {
        CreateMap<Style, StyleDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name))
            .ForMember(x => x.BasePrice, y => y.MapFrom(z => z.BasePrice))
            .ForMember(x => x.SecondaryPrice, y=> y.MapFrom(z => z.SecondaryPrice))
            .ForMember(x => x.OnetimeVisitPrice, y => y.MapFrom(z => z.OnetimeVisitPrice))
            .ForMember(x => x.BaseSalary, y => y.MapFrom(z => z.BaseSalary))
            .ForMember(x => x.BonusSalary, y => y.MapFrom(z => z.BonusSalary))
            .ForMember(x => x.Active, y => y.MapFrom(z => z.Active));
    }
}