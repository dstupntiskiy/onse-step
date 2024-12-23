using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Services;

namespace Scheduler.Application.Queries.Groups;

public class GetAllGroupsWithDetailsHandler(IMapper mapper,
    IRepository<Group> groupRepository,
    IRepository<GroupMemberLink> groupMembersRepository,
    IRepository<Membership> membershipRepository,
    MembershipService membershipService
    ) : IRequestHandler<GetAllGroupsWithDetails, List<GroupDetailedDto>>
{
    public async Task<List<GroupDetailedDto>> Handle(GetAllGroupsWithDetails request,
        CancellationToken cancellationToken)
    {
        var groupsWithMembers = groupRepository.Query().Where(x => x.Active == request.OnlyActive || !request.OnlyActive)
            .GroupJoin(groupMembersRepository.Query(),
                gr => gr.Id,
                member => member.Group.Id,
                (gr, member) => new
                {
                    Gr = gr,
                    Members = member.DefaultIfEmpty(),
                })
            .SelectMany(x=> x.Members, (gr, m) => new
            {
                g = gr.Gr,
                member = m,
                membership = membershipRepository
                    .Query()
                    .FirstOrDefault(x => m != null 
                                                 && x.Client.Id == m.Client.Id
                                                 && (x.Unlimited || (x.Style != null && x.Style.Id == gr.Gr.Style.Id))
                                                 && (x.StartDate >= gr.Gr.StartDate && (gr.Gr.EndDate == null  || x.StartDate <= gr.Gr.EndDate)
                                                 || (x.EndDate >= gr.Gr.StartDate && (gr.Gr.EndDate == null || x.EndDate <= gr.Gr.EndDate))))
            }).ToList();
        
        var result = groupsWithMembers.GroupBy(x => x.g).Select(x =>
        {
            var group = mapper.Map<GroupDetailedDto>(x.Key);
            group.MembersCount = x.Count(y => y.member != null);
            group.MembershipsCount = x.Count(y => y.membership != null);
            return group; 
        }).ToList();
        
        return result.OrderBy(x => x.Name).ToList();
    }
}