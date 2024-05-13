using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Groups;

public record SaveGroupQuery(Guid id, string name, string style) : IRequest<GroupDto>;