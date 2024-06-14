using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Coaches.CoachSave;

public class CommandHandler(IMapper mapper, IRepository<Coach> coachRepository) : IRequestHandler<Command, CoachDto>
{
    public async Task<CoachDto> Handle(Command request, CancellationToken cancellationToken)
    {
        var coach = await coachRepository.GetById(request.Id);
        coach = coach ?? new Coach();

        coach.Name = request.Name;
        coach.Style = request.Style;
        coach.Active = true;

        return mapper.Map<CoachDto>(await coachRepository.AddAsync(coach));
    }
}