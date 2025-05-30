using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos.Reports;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Reports;

public record GetEventDutyByPeriodQuery(DateTime StartDate, DateTime EndDate) : IRequest<List<EventDutyReportDto>>;

public class GetEventDutyByPeriodQueryHandler(IRepository<EventDuty> eventDutyRepository, IMapper mapper) : IRequestHandler<GetEventDutyByPeriodQuery, List<EventDutyReportDto>>
{
    public async Task<List<EventDutyReportDto>> Handle(GetEventDutyByPeriodQuery request,
        CancellationToken cancellationToken)
    {
        var duties = eventDutyRepository.Query()
            .Where(x => x.StartDateTime >= request.StartDate && x.StartDateTime <= request.EndDate).ToList();

        var reportDtos = duties
            .GroupBy(e => e.Name)
            .Select(group => new EventDutyReportDto
            {
                Name = group.Key,
                TotalHours = group.Sum(e => (e.EndDateTime - e.StartDateTime).TotalHours),
                EventDutyDetails = group.Select(mapper.Map<EventDutyDetailDto>).ToList()
            })
            .ToList();

        return reportDtos;
    }
}
