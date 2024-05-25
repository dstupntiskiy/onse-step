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
        var client = new Client()
        {
            Id = request.Id,
            Name = request.Name,
            SocialMediaLink = request.SocialMediaLink,
            Phone = request.Phone
        };

        return mapper.Map<ClientDto>(await clientRepository.AddAsync(client));
    }
}