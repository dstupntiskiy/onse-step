using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Coaches;

public class GetAllCoachesQueryHandler(IMapper mapper, IRepository<Coach> coachRepository) : IRequestHandler<GetAllCoachesQuery, List<CoachDto>>
{
    public async Task<List<CoachDto>> Handle(GetAllCoachesQuery request, CancellationToken cancellationToken)
    {
        var coaches =  request.OnlyActive
            ? mapper.Map<List<CoachDto>>(coachRepository.Query().Where(x => x.Active == true).ToList())
            : mapper.Map<List<CoachDto>>(await coachRepository.GetAll());
        return coaches.OrderBy(x => x.Name).ToList();
    }
}