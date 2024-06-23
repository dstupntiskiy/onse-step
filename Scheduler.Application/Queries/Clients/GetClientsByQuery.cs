using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Queries.Clients;

public class GetClientsByQuery(string query) : IRequest<List<ClientDto>>
{
    public string Query { get; } = query;
}