using MediatR;
using Scheduler.Application.Common.Dtos.Reports;

namespace Scheduler.Application.Queries.Reports.GetAllCoachesEventsWithParticipants;

public record GetAllCoachesEventsWithParticipantsByPeriodQuery(DateTime StartDate, DateTime EndDate) :IRequest<List<CoachWithEventsDto>>;