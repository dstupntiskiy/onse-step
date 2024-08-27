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
            .FirstOrDefault(x => date == null || (date > x.StartDate && date < x.EndDate));
        
        if (membership is null)
        {
            return null;
        }

        var membershipWithDetails = mapper.Map<MembershipWithDetailsDto>(membership);
        membershipWithDetails.Visited = await GetVisitedCount(clientId, membershipWithDetails.Id);
        membershipWithDetails.Expired = membershipWithDetails.EndDate < DateTime.Now;

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
        membershipWithDetails.Visited = await GetVisitedCount(clientId, membershipWithDetails.Id);
        membershipWithDetails.Expired = membershipWithDetails.EndDate < DateTime.Now;

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

    public async Task<int> GetVisitedCount(Guid clientId, Guid membershipId)
    {
        var membership = await membershipRepository.GetById(membershipId);
        var participance = participanceRepository.Query().Where(x => x.Client.Id == clientId).ToList();
        var count = participance.Count(x => x.Client.Id == clientId
                                            && x.Event.Group != null
                                            && membership.StartDate < x.Event.StartDateTime
                                            && membership.EndDate.AddDays(1).AddSeconds(-1) > x.Event.StartDateTime
                                            && (membership.Unlimited || (membership.Style != null &&
                                                                         membership.Style.Id ==
                                                                         x.Event.Group.Style.Id)));
        return count;
    }
}