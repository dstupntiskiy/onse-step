using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Payments.GroupPaymentSave;

public class CommandHandler(
    IRepository<GroupPayment> groupPaymentRepository,
    IRepository<GroupMemberLink> groupMemberLinkRepository,
    IMapper mapper) : IRequestHandler<Command,GroupPaymentDto>
{
    public async Task<GroupPaymentDto> Handle(Command request, CancellationToken cancellationToken)
    {
        if (groupPaymentRepository.Query()
            .Any(x => x.GroupMemberLink.Id == request.EntityId && x.Id != request.Id))
        {
            throw new ValidationException("Оплата уже добавлена");
        }

        var payment = await groupPaymentRepository.GetById(request.Id);
        var groupMemberLink = await groupMemberLinkRepository.GetById(request.EntityId);
        payment = payment ?? new GroupPayment();
        payment.Amount = request.Amount;
        payment.Comment = request.Comment;
        payment.GroupMemberLink = groupMemberLink;

        try
        {
            return mapper.Map<GroupPaymentDto>(await groupPaymentRepository.AddAsync(payment));
        }
        catch (Exception e)
        {
            throw new ValidationException("Не удалось сохранить оплату", e);
        }
    }
}