using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Queries.Groups;

public record GetAllGroupQuery() : IRequest<GroupDto[]>;
