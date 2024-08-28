using System.ComponentModel.DataAnnotations;
using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Clients.ClientDelete;

public class ClientDeleteCommandHandler(
    IRepository<Client> clientRepository,
    IRepository<GroupMemberLink> groupMemberLinkRepository,
    IRepository<Membership> membershipRepository,
    IRepository<OneTimeVisit> oneTimeVisitRepository) : IRequestHandler<ClientDeleteCommand, Guid> 
{
    public async Task<Guid> Handle(ClientDeleteCommand request, CancellationToken cancellationToken)
    {
        if (!clientRepository.Query().Any(x => x.Id == request.Id))
        {
            throw new ValidationException("Клиента с таким ID не существует");
        }
        
        if (groupMemberLinkRepository.Query().Any(x => x.Client.Id == request.Id))
        {
            throw new ValidationException("Не удалось удалить клиента. Он уже состоит в группе");
        }

        if (membershipRepository.Query().Any(x => x.Client.Id == request.Id))
        {
            throw new ValidationException("Не удалось удалить клиента. Он уже приобрел абонемент");
        }

        if (oneTimeVisitRepository.Query().Any(x => x.Client.Id == request.Id))
        {
            throw new ValidationException("Не удалось удалить клиента. Он уже посетил разово занятие");
        }
        await clientRepository.DeleteAsync(request.Id, cancellationToken);
        return request.Id;
    }
}