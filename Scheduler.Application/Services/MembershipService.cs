using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Services;

public class MembershipService(IMapper mapper,
    IRepository<Membership> membershipRepository,
    IRepository<EventParticipance> participanceRepository)
{
    public async Task<MembershipWithDetailsDto?> GetActualMembership(Guid clientId, Guid? styleId, DateTime? date)
    {
        var membership = GetMemberships(clientId, styleId)
            .FirstOrDefault(x => 
                date == null || 
                (date > x.StartDate 
                    && date < x.EndDate.AddDays(1).AddSeconds(-1)));
        
        if (membership is null)
        {
            return null;
        }

        var membershipWithDetails = mapper.Map<MembershipWithDetailsDto>(membership);
        (membershipWithDetails.Visited, membershipWithDetails.Expired) = await GetVisitedCount(clientId, membershipWithDetails.Id, date);

        return membershipWithDetails;
    }

    public async Task<MembershipWithDetailsDto?> GetActualMembership(Guid clientId, Guid? styleId, DateTime startDate,
        DateTime? endDate)
    {
        var membership = GetMemberships(clientId, styleId)
            .FirstOrDefault(x => (x.StartDate >= startDate && (endDate is null || x.StartDate <= endDate))
            || (x.EndDate >= startDate && (endDate is null || x.EndDate <= endDate)));
        
        if (membership is null)
        {
            return null;
        }
        
        var membershipWithDetails = mapper.Map<MembershipWithDetailsDto>(membership);
        (membershipWithDetails.Visited, membershipWithDetails.Expired) = await GetVisitedCount(clientId, membershipWithDetails.Id, null);

        return membershipWithDetails;
    }
    
    private List<Membership> GetMemberships(Guid clientId, Guid? styleId)
    {
        return membershipRepository.Query()
            .Where(x => x.Client.Id == clientId
                        && (x.Unlimited || (x.Style != null && x.Style.Id == styleId)))
            .OrderByDescending(x => x.StartDate)
            .ToList();
    }

    public async Task<(int, bool)> GetVisitedCount(Guid clientId, Guid membershipId, DateTime? date)
    {
        var membership = await membershipRepository.GetById(membershipId);
        var participance = participanceRepository.Query().Where(x => x.Client.Id == clientId
            && (date == null || x.Event.StartDateTime <= date)).ToList();
        var count = participance.Count(x => x.Client.Id == clientId
                                            && x.Event.Group != null
                                            && membership.StartDate < x.Event.StartDateTime
                                            && membership.EndDate.AddDays(1).AddSeconds(-1) > x.Event.StartDateTime
                                            && (membership.Unlimited || (membership.Style != null &&
                                                                         membership.Style.Id ==
                                                                         x.Event.Group.Style.Id)));

        var isExpired = count > membership.VisitsNumber;
        return (count, isExpired);
    }
}