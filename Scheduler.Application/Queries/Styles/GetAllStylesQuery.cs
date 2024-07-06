using MediatR;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Queries.Styles;

public record GetAllStylesQuery() : IRequest<List<Style>>;