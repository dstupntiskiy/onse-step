using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Mappings;

public class MembershipMapping : Profile
{
        public MembershipMapping()
        {
            CreateMap<Membership, MembershipDto>()
                .ForMember(x => x.Amount, y => y.MapFrom(z => z.Amount))
                .ForMember(x => x.Comment, y => y.MapFrom(z => z.Comment))
                .ForMember(x => x.StartDate, y => y.MapFrom(z => z.StartDate))
                .ForMember(x => x.EndDate, y => y.MapFrom(z => z.EndDate))
                .ForMember(x => x.VisitsNumber, y => y.MapFrom(z => z.VisitsNumber))
                .ForMember(x => x.Client, y => y.MapFrom(z => z.Client))
                .ForMember(x => x.Style, y => y.MapFrom(z => z.Style))
                .ForMember(x => x.Unlimited, y => y.MapFrom(z=> z.Unlimited));
        
            CreateMap<Membership, MembershipWithDetailsDto>()
                .ForMember(x => x.Amount, y => y.MapFrom(z => z.Amount))
                .ForMember(x => x.Comment, y => y.MapFrom(z => z.Comment))
                .ForMember(x => x.StartDate, y => y.MapFrom(z => z.StartDate))
                .ForMember(x => x.EndDate, y => y.MapFrom(z => z.EndDate))
                .ForMember(x => x.VisitsNumber, y => y.MapFrom(z => z.VisitsNumber))
                .ForMember(x => x.Client, y => y.MapFrom(z => z.Client))
                .ForMember(x => x.Style, y => y.MapFrom(z => z.Style))
                .ForMember(x => x.Unlimited, y => y.MapFrom(z=> z.Unlimited));
        }
}