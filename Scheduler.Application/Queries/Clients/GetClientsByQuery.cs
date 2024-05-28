using MediatR;
using Scheduler.Application.Entities.Projections;

namespace Scheduler.Application.Queries.Clients;

public class GetClientsByQuery(string query) : IRequest<List<ClientProjection>>
{
    public string Query { get; } = query;
}