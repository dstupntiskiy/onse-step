using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Mappings;

public class GroupMapping : Profile
{
    public GroupMapping()
    {
        this.CreateMap<Group, GroupDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name))
            .ForMember(x => x.Style, y => y.MapFrom(z => z.Style))
            .ForMember(x => x.Active, y => y.MapFrom(z => z.Active));

        this.CreateMap<Group, GroupDetailedDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name))
            .ForMember(x => x.Style, y => y.MapFrom(z => z.Style));
        
        this.CreateMap<GroupProjection, GroupDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name));

        this.CreateMap<Group, GroupProjection>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name))
            .ForMember(x => x.Style, y=>y.MapFrom(z =>z.Style));

        this.CreateMap<GroupMemberLink, GroupMemberDto>()
            .ForMember(x => x.Member, y => y.MapFrom(z => z.Client))
            .ForMember(x => x.Group, y => y.MapFrom(z => z.Group));
    }
}