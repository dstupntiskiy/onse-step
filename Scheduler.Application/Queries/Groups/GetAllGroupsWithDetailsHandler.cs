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
    IRepository<GroupPayment> groupPaymentRepository,
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
                member = m
            }).ToList();

        var result = groupsWithMembers.GroupBy(x => x.g).Select(x =>
        {
            var group = mapper.Map<GroupDetailedDto>(x.Key);
            group.MembersCount = x.Count();
            group.MembershipsCount = Task.WhenAll(x.Select(async y =>
                {
                    if (y.member != null)
                    {
                        return await membershipService.GetActualMembership(y.member.Client.Id, x.Key.Style.Id, x.Key.StartDate,
                            x.Key.EndDate);
                    }

                    return null;
                }
            ).ToList()).Result.Count(z => z is not null);
            return group;
        }).ToList();
        
        return result.OrderBy(x => x.Name).ToList();
    }
}