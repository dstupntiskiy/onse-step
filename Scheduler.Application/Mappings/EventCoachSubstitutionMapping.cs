using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Mappings;

public class EventCoachSubstitutionMapping : Profile
{
    public EventCoachSubstitutionMapping()
    {
        CreateMap<EventCoachSubstitution, EventCoachSubstitutionDto>()
            .ForMember(x => x.Coach, y => y.MapFrom(z => z.Coach));
    }
}