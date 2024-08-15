using AutoMapper;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Services;

public class MembershipService(IMapper mapper,
    IRepository<Membership> membershipRepository,
    IRepository<EventParticipance> participanceRepository)
{
    public async Task<MembershipWithDetailsDto?> GetActualMembership(Guid? styleId, Guid clientId)
    {
        var membership = membershipRepository.Query()
            .Where(x => x.Client.Id == clientId
                    && (x.Unlimited || (x.Style != null && x.Style.Id == styleId)))
            .OrderByDescending(x => x.StartDate)
            .FirstOrDefault();
        if (membership == null)
        {
            return null;
        }

        var membershipWithDetails = mapper.Map<MembershipWithDetailsDto>(membership);
        membershipWithDetails.Visited = await GetVisitedCount(clientId, membershipWithDetails.Id);

        return membershipWithDetails;
    }

    public async Task<int> GetVisitedCount(Guid clientId, Guid membershipId)
    {
        var membership = await membershipRepository.GetById(membershipId);
        var participance = participanceRepository.Query().Where(x => x.Client.Id == clientId).ToList();
        var count = participance.Count(x => x.Client.Id == clientId
                                            && x.Event.Group != null
                                            && membership.StartDate < x.Event.StartDateTime
                                            && membership.EndDate > x.Event.StartDateTime
                                            && (membership.Unlimited || (membership.Style != null &&
                                                                         membership.Style.Id ==
                                                                         x.Event.Group.Style.Id)));
        return count;
    }
}