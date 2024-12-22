using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Clients;

public record GetAllClientsQuery(int Take, int Skip) : IRequest<List<ClientDto>>;
