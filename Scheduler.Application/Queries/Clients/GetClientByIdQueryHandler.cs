using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Clients;

public class GetClientByIdQueryHandler(IRepository<Client> clientRepository,
    IMapper mapper) : IRequestHandler<GetClientByIdQuery, ClientDto>
{
    public async Task<ClientDto> Handle(GetClientByIdQuery request, CancellationToken cancellationToken)
    {
        var client = await clientRepository.GetById(request.Id);

        return mapper.Map<ClientDto>(client);
    }
    
}