using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Events;

public class AddCoachSubstitutionCommandHandler(IRepository<EventCoachSubstitution> eventCoachSubstitutionRepository,
    IRepository<Coach> coachRepository,
    IRepository<Event> eventRepository,
    IMapper mapper) : IRequestHandler<AddCoachSubstitutionCommand, EventCoachSubstitutionDto>
{
    public async Task<EventCoachSubstitutionDto> Handle(AddCoachSubstitutionCommand request, CancellationToken cancellationToken)
    {
        if (eventCoachSubstitutionRepository.Query().Any(x => x.Event.Id == request.EventId))
        {
            throw new ValidationException("Событие уже содержит замену тренера");
        }

        var coach = await coachRepository.GetById(request.CoachId)!;
        if (coach == null)
        {
            throw new ValidationException($"Тренера с Id {request.CoachId} не существует");
        }
        var ev = await eventRepository.GetById(request.EventId)!;
        if (ev == null)
        {
            throw new ValidationException($"События с Id {request.EventId} не существует");
        }

        var substitution = new EventCoachSubstitution()
        {
            Coach = coach,
            Event = ev
        };

        return mapper.Map<EventCoachSubstitutionDto>(await eventCoachSubstitutionRepository.AddAsync(substitution));
    }
}