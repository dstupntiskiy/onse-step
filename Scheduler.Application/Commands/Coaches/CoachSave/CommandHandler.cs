using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Coaches.CoachSave;

public class CommandHandler(
    IMapper mapper, 
    IRepository<Coach> coachRepository,
    IRepository<Style> styleRepository) : IRequestHandler<Command, CoachDto>
{
    public async Task<CoachDto> Handle(Command request, CancellationToken cancellationToken)
    {
        var coach = await coachRepository.GetById(request.Id);
        coach = coach ?? new Coach();

        var style = await styleRepository.GetById(request.StyleId);

        coach.Name = request.Name;
        coach.Style = style;
        coach.Active = true;

        return mapper.Map<CoachDto>(await coachRepository.AddAsync(coach));
    }
}