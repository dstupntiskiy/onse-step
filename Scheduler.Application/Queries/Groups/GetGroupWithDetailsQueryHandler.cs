using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Groups;

public class GetGroupWithDetailsQueryHandler(IRepository<Group> groupRepository,
    IRepository<GroupMemberLink> groupMembersRepository,
    IRepository<GroupPayment> groupPaymentRepository) : IRequestHandler<GetGroupWithDetailsQuery, GroupDetailedDto>
{
    public async Task<GroupDetailedDto> Handle(GetGroupWithDetailsQuery request, CancellationToken cancellationToken)
    {
        var groupsWithMembers = groupRepository.Query().Where(x => x.Id == request.groupId)
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

        var result = grr.Select(gr => new GroupDetailedDto()
        {
            Name = gr.Key.Name,
            Id = gr.Key.Id,
            Style = gr.Key.Style,
            MembersCount = gr.Count(g => g.member != null),
            PayedCount = gr.Sum(g => g.payment.Count(p => p != null))
        }).ToList().Single();

        return result;
    }
}