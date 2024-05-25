using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Queries.Clients;

public class Mapping : Profile
{
    public Mapping()
    {
        this.CreateMap<Client, ClientDto>()
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Name))
            .ForMember(x => x.Phone, y => y.MapFrom(z => z.Phone))
            .ForMember(x => x.SocialMediaLink, y => y.MapFrom(z => z.SocialMediaLink));
    }
}