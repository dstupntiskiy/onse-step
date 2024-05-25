using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Clients;

public class GetAllClientsQuery() : IRequest<List<ClientDto>>
{
    
}