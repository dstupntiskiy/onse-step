using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Clients;

public class GetClientsByQueryHandler(IMapper mapper, IRepository<Client> clientRepository) : IRequestHandler<GetClientsByQuery, List<ClientDto>>
{
    public async Task<List<ClientDto>> Handle(GetClientsByQuery request, CancellationToken cancellationToken)
    {
        if (request.Query.Equals(String.Empty))
        {
            throw new ValidationException("Запрос не может быть пустым");
        }
        var clients = clientRepository.Query()
            .Where(x => x.Name.ToLower().Contains(request.Query.ToLower())
             || x.SocialMediaLink.ToLower().Contains(request.Query.ToLower())).ToList();

        return mapper.Map<List<ClientDto>>(clients);
    }
}