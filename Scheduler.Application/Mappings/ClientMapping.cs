using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Mappings;

public class ClientMapping : Profile
{
    public ClientMapping()
    {
        CreateMap<Client, ClientDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name))
            .ForMember(x => x.Phone, y => y.MapFrom(z => z.Phone))
            .ForMember(x => x.SocialMediaLink, y => y.MapFrom(z => z.SocialMediaLink))
            .ForMember(x => x.CreateDate, y=> y.MapFrom(z=> z.CreateDate));

        CreateMap<Client, ClientProjection>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name))
            .ForMember(x => x.SocialMediaLink, y => y.MapFrom(z => z.SocialMediaLink));

        CreateMap<OneTimeVisit, OnetimeVisitSimpleDto>()
            .ForMember(x => x.Date, y => y.MapFrom(z => z.Event.StartDateTime))
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Event.Group != null ? z.Event.Group.Style.Name : z.Event.Name));
    }
}