using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Clients;

public record GetClientOnetimeVisitsQuery(Guid Id) : IRequest<List<OnetimeVisitSimpleDto>>;