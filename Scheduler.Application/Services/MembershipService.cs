using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Services;

public class MembershipService(IMapper mapper,
    IRepository<Membership> membershipRepository,
    IRepository<EventParticipance> participanceRepository)
{
    public MembershipWithDetailsDto? GetActualMembership(Guid? styleId, Guid clientId)
    {
        if (styleId == null)
            return null;
        
        var membership = membershipRepository.Query()
            .Where(x => x.Client.Id == clientId
                    && x.Style.Id == styleId)
            .OrderByDescending(x => x.StartDate)
            .FirstOrDefault();
        if (membership == null)
        {
            return null;
        }

        var participance = participanceRepository.Query().Where(x => x.Client.Id == clientId).ToList();

        var membershipWithDetails = mapper.Map<MembershipWithDetailsDto>(membership);
        membershipWithDetails.Visited = participance.Count(x => 
                                                                x.Event.Group is { Style: not null }
                                                                && membership.StartDate < x.Event.StartDateTime
                                                                && membership.EndDate > x.Event.StartDateTime
                                                                && (membership.Style.Id == x.Event.Group.Style.Id
                                                                    || membership.Unlimited));

        return membershipWithDetails;
    }
}