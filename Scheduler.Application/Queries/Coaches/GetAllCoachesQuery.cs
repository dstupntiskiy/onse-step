using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Coaches;

public record GetAllCoachesQuery(bool OnlyActive) :IRequest<List<CoachDto>>;