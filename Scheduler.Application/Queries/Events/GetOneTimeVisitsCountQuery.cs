using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Events;

public record GetOneTimeVisitsCountQuery(Guid EventId) : IRequest<int>;