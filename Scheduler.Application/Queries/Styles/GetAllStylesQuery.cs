using MediatR;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Queries.Styles;

public record GetAllStylesQuery(bool OnlyActive) : IRequest<List<Style>>;