using MediatR;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Commands.Styles.StyleSave;

public record Command(Guid Id, string Name, decimal BasePrice, decimal SecondaryPrice, decimal OnetimeVisitPrice) : IRequest<Style>;