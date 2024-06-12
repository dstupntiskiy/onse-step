using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Events;

public record GetOneTimeVisitsQuery(Guid EventId) : IRequest<List<OneTimeVisitDto>>;