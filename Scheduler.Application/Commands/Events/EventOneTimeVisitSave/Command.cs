using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Commands.Events.EventOneTimeVisitSave;

public record Command(Guid ClientId, Guid EventId) : IRequest<OneTimeVisitDto>;