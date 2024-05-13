using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Entities;

namespace Scheduler.Application.Queries.Groups;

public class Mapping : Profile
{
    public Mapping()
    {
        this.CreateMap<Group, GroupDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name))

            .ForMember(x => x.Id, y => y.MapFrom(z => z.Id))
            .ForMember(x => x.CreateDate, y => y.MapFrom(z => z.CreateDate))

            .ForMember(x => x.Style, y => y.MapFrom(z => z.Style));
    }
}