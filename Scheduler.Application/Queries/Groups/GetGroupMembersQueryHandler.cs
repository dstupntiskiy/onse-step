using AutoMapper;
using AutoMapper.Execution;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Queries.Groups;

public class GetGroupMembersQueryHandler(
    IMapper mapper,
    IRepository<GroupPayment> groupPaymentRepository,
    IRepository<GroupMemberLink> groupMembersRepository) : IRequestHandler<GetGroupMembersQuery, List<GroupMemberDto>>
{
    public async Task<List<GroupMemberDto>> Handle(GetGroupMembersQuery request, CancellationToken cancellationToken)
    {
        var groupMembers = groupMembersRepository.Query()
            .Where(x => x.Group.Id == request.GroupId)
            .GroupJoin(groupPaymentRepository.Query(),
                member => member.Id,
                payment => payment.GroupMemberLink.Id,
                (member, payment) => new { member, payment = payment.DefaultIfEmpty() })
            .SelectMany( z => z.payment, (member, payment) => 
                    new GroupMemberDto()
                {
                    Id = member.member.Id,
                    Member = mapper.Map<ClientProjection>(member.member.Client),
                    Group = mapper.Map<GroupProjection>(member.member.Group),
                    Payment = mapper.Map<PaymentDto>(payment)
                })
            .ToList()
            .OrderBy(x => x.Member.Name).ToList();

        return groupMembers;
    }
}