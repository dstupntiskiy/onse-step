using System.ComponentModel.DataAnnotations;
using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Groups.GroupRemoveMember;

public class CommandHandler(IRepository<GroupMemberLink> groupMemberLinkRepository,
    IRepository<EventParticipance> eventParticipanceRepository,
    IRepository<GroupPayment> groupPaymentRepository) : IRequestHandler<Command>
{
    public async Task Handle(Command request, CancellationToken cancellationToken)
    {
        var participances = eventParticipanceRepository.Query()
            .Where(x => x.Client.Id == request.ClientId && x.Event.Group.Id == request.GroupId).ToList();
        if (participances.Count > 0)
        {
            throw new ValidationException(
                $"Невозможно удалить клиента из группы. Он уже посетил занятие {participances[0].Event.Name} {participances[0].Event.StartDateTime}");
        }
        

        var groupMemberLink = groupMemberLinkRepository.Query()
            .Single(x => x.Client.Id == request.ClientId && x.Group.Id == request.GroupId);
        if(groupPaymentRepository.Query().Any(x => x.GroupMemberLink.Id == groupMemberLink.Id))
        {
            throw new ValidationException("Нужно сначала удалить оплату");
        }
        await groupMemberLinkRepository.DeleteAsync(groupMemberLink.Id, cancellationToken);
    }
}