using AutoMapper;
using Scheduler.Application.Common.Dtos.Reports;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Mappings;

public class EventDutyMapping : Profile
{
    public EventDutyMapping()
    {
        CreateMap<EventDuty, EventDutyDetailDto>()
            .ForMember(x => x.StartDate, y => y.MapFrom(z => z.StartDateTime))
            .ForMember(x => x.EndDate, y => y.MapFrom(z => z.EndDateTime));
    }
}