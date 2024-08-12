using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Clients;

public record GetClientByIdQuery(Guid Id) : IRequest<ClientDto>;