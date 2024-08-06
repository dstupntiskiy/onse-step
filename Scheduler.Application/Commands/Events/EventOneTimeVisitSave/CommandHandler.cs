using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Events.EventOneTimeVisitSave;

public class CommandHandler(
    IMapper mapper, 
    IRepository<OneTimeVisit> onetimeVisitRepository,
    IRepository<Event> eventRepository,
    IRepository<Client> clientRepository,
    IRepository<GroupMemberLink> groupMembersRepository) : IRequestHandler<Command, OneTimeVisitDto>
{
    public async Task<OneTimeVisitDto> Handle(Command request, CancellationToken cancellationToken)
    {
        if (onetimeVisitRepository.Query().Any(x => x.Client.Id == request.ClientId && x.Event.Id == request.EventId))
        {
            throw new ValidationException($"Клиент уже посещает это занятие разово");
        }

        var ev = await eventRepository.GetById(request.EventId);
        
        var oneTimeVisit = new OneTimeVisit()
        {
            Client = await clientRepository.GetById(request.ClientId),
            Event = ev
        };

        return mapper.Map<OneTimeVisitDto>(await onetimeVisitRepository.AddAsync(oneTimeVisit));
    }
}