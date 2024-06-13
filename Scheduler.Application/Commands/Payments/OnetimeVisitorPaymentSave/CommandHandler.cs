using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Payments.OnetimeVisitorPaymentSave;

public class CommandHandler(IMapper mapper, 
    IRepository<OneTimeVisitPayment> onetimePaymentRepository,
    IRepository<OneTimeVisit> onetimeVisitRepository) : IRequestHandler<Command, OnetimePaymentDto>
{
    public async Task<OnetimePaymentDto> Handle(Command request, CancellationToken cancellationToken)
    {
        if (onetimePaymentRepository.Query()
            .Any(x => x.OneTimeVisit.Id == request.EntityId && x.Id != request.Id))
        {
            throw new ValidationException("Оплата уже добавлена");
        }

        var visitor = await onetimeVisitRepository.GetById(request.EntityId);
        var payment = new OneTimeVisitPayment()
        {
            Amount = request.Amount,
            Comment = request.Comment,
            OneTimeVisit = visitor,
            Id = request.Id
        };

        try
        {
            return mapper.Map<OnetimePaymentDto>(await onetimePaymentRepository.AddAsync(payment));
        }
        catch (Exception e)
        {
            throw new ValidationException("Не удалось сохранить оплату, e");
        }
    }
}