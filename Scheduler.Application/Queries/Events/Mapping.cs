using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Entities;

namespace Scheduler.Application.Queries.Events;

public class Mapping : Profile
{
    public Mapping()
    {
        this.CreateMap<Event, EventDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name))
            .ForMember(x => x.StartDateTime, y => y.MapFrom(z => z.StartDateTime))
            .ForMember(x => x.EndDateTime, y => y.MapFrom(z => z.EndDateTime))
            .ForMember(x => x.Color, y => y.MapFrom(z => z.Color))
            .ForMember(x => x.Group, y => y.MapFrom(z => z.Group))
            .ForMember(x=> x.Recurrency, y=>y.MapFrom(z=>z.Reccurrency));
    }
}