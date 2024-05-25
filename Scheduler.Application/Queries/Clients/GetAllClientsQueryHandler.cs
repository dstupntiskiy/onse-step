using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Clients;

public class GetAllClientsQueryHandler(IMapper mapper, IRepository<Client> clientRepository) : IRequestHandler<GetAllClientsQuery, List<ClientDto>>
{
    public async Task<List<ClientDto>> Handle(GetAllClientsQuery request, CancellationToken cancellationToken)
    {
        return mapper.Map<List<ClientDto>>(await clientRepository.GetAll());
    }
    
}