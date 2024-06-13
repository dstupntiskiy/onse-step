using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Commands.Events;

public class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<OneTimeVisit, OneTimeVisitDto>()
            .ForMember(x => x.Client, y => y.MapFrom(z => z.Client))
            .ForMember(x => x.EventId, y => y.MapFrom(z => z.Event.Id));
    }
}