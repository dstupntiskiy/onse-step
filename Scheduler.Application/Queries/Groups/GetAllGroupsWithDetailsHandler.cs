using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Groups;

public class GetAllGroupsWithDetailsHandler(IMapper mapper,
    IRepository<Group> groupRepository,
    IRepository<GroupMemberLink> groupMembersRepository,
    IRepository<GroupPayment> groupPaymentRepository
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
        var grr = groupsWithMembers
            .GroupJoin(groupPaymentRepository.Query(),
                gm => gm.member?.Id,
                p => p.GroupMemberLink.Id,
                (gm, p) => new
                {
                    gr= gm.g,
                    member = gm.member,
                    payment = p.DefaultIfEmpty()
                })
            .GroupBy(x => x.gr)
            .ToList();

        var result = grr.Select(gr =>
        {
            var group = mapper.Map<GroupDetailedDto>(gr.Key);
            group.MembersCount = gr.Count(g => g.member != null);
            group.PayedCount = gr.Sum(g => g.payment.Count(p => p != null));
            return group;
        }).ToList();
        
        return result.OrderBy(x => x.Name).ToList();
    }
}