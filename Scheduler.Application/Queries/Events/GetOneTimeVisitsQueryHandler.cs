using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Events;

public class GetOneTimeVisitsQueryHandler(IMapper mapper, 
    IRepository<OneTimeVisit> onetimeVisitRepository,
    IRepository<OneTimeVisitPayment> onetimeVisitPaymentRepository) : IRequestHandler<GetOneTimeVisitsQuery, List<OneTimeVisitDto>>
{
    public async Task<List<OneTimeVisitDto>> Handle(GetOneTimeVisitsQuery request, CancellationToken cancellationToken)
    {
        var visitors = onetimeVisitRepository.Query()
            .Where(x => x.Event.Id == request.EventId)
            .GroupJoin(onetimeVisitPaymentRepository.Query(),
                visitor => visitor.Id,
                payment => payment.OneTimeVisit.Id,
                (visitor, payment) => new { visitor, payment = payment.DefaultIfEmpty() })
            .SelectMany(z => z.payment, (visitor, payment) =>
                new OneTimeVisitDto()
                {
                    Id = visitor.visitor.Id,
                    EventId = visitor.visitor.Event.Id,
                    Client = mapper.Map<ClientDto>(visitor.visitor.Client),
                    Payment = mapper.Map<PaymentDto>(payment)
                }).ToList()
            .OrderBy(x => x.Client.Name).ToList();
        return visitors;
    }
}