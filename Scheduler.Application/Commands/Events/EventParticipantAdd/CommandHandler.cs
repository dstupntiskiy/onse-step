using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MediatR;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Events.EventParticipantAdd;

public class CommandHandler(IMapper mapper,
    IRepository<Client> clientRepository,
    IRepository<EventParticipance> eventParticipanceRepository,
    IRepository<Event> eventRepository) : IRequestHandler<Command,Guid>
{
    public async Task<Guid> Handle(Command request, CancellationToken cancellationToken)
    {
        if(eventParticipanceRepository.Query().Any(x => x.Event.Id == request.EventId && x.Client.Id == request.ClientId))
        {
            throw new ValidationException("Клиент отмечен в этом событии");
        }
        
        var client = await clientRepository.GetById(request.ClientId);
        var ev = await eventRepository.GetById(request.EventId);
        var participance = new EventParticipance()
        {
            Client = client,
            Event = ev
        };

        participance = await eventParticipanceRepository.AddAsync(participance);
        return participance.Id;
    }
}