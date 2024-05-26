using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Clients.ClientSave;

public class CommandHandler(IMapper mapper, IRepository<Client> clientRepository) : IRequestHandler<Command, ClientDto>
{
    public async Task<ClientDto> Handle(Command request, CancellationToken cancellationToken)
    {
        var client = await clientRepository.GetById(request.Id);
        client = client == null ? new Client() : client;

        client.Id = request.Id;
        client.Name = request.Name;
        client.SocialMediaLink = request.SocialMediaLink;
        client.Phone = request.Phone;

        return mapper.Map<ClientDto>(await clientRepository.AddAsync(client));
    }
}