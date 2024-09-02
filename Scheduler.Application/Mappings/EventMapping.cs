using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Mappings;

public class EventMapping : Profile
{
    public EventMapping()
    {
        CreateMap<Event, EventDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name))
            .ForMember(x => x.StartDateTime, y => y.MapFrom(z => z.StartDateTime))
            .ForMember(x => x.EndDateTime, y => y.MapFrom(z => z.EndDateTime))
            .ForMember(x => x.Color, y => y.MapFrom(z => z.Color))
            .ForMember(x => x.Group, y => y.MapFrom(z => z.Group))
            .ForMember(x=> x.Recurrence, y=>y.MapFrom(z=>z.Recurrence))
            .ForMember(x => x.Coach, y=> y.MapFrom(z => z.Coach))
            .ForMember(x => x.EventType, y => y.MapFrom(z => z.EventType));
        
        CreateMap<OneTimeVisit, OneTimeVisitDto>()
            .ForMember(x => x.Client, y => y.MapFrom(z => z.Client))
            .ForMember(x => x.EventId, y => y.MapFrom(z => z.Event.Id));

    }
}