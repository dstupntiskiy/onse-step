using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Commands.Payments;

public class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<Payment, PaymentDto>()
            .ForMember(x => x.Amount, y => y.MapFrom(z => z.Amount))
            .ForMember(x => x.Comment, y => y.MapFrom(z => z.Comment));

        CreateMap<GroupPayment, GroupPaymentDto>()
            .ForMember(x => x.GroupMemberId, y => y.MapFrom(z => z.GroupMemberLink.Id));
        
        CreateMap<GroupPayment, PaymentDto>()
            .ForMember(x => x.Amount, y => y.MapFrom(z => z.Amount))
            .ForMember(x => x.Comment, y => y.MapFrom(z => z.Comment));

        CreateMap<OneTimeVisitPayment, OnetimePaymentDto>()
            .ForMember(x => x.OnetimeVisitId, y => y.MapFrom(z => z.OneTimeVisit.Id));
    }
}