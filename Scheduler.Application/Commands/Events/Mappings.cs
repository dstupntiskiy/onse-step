using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Commands.Events;

public class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<OneTimeVisit, OneTimeVisitDto>()
            .ForMember(x => x.ClientId, y => y.MapFrom(z => z.Client.Id))
            .ForMember(x => x.EventId, y => y.MapFrom(z => z.Event.Id));
    }
}