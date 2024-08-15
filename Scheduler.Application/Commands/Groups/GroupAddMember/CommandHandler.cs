using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Projections;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Services;

namespace Scheduler.Application.Commands.Groups.GroupAddMember;

public class CommandHandler(
    IMapper mapper, 
    IRepository<GroupMemberLink> groupMemberRepository,
    IRepository<Group> groupRepository,
    IRepository<Client> clientRepository,
    MembershipService membershipService) : IRequestHandler<Command, GroupMemberDto>
{
    public async Task<GroupMemberDto> Handle(Command request, CancellationToken cancellationToken)
    {
        if (groupMemberRepository.Query().Any(x =>
                x.Group.Id == request.GroupId
                && x.Client.Id == request.ClientId))
        {
            throw new ValidationException($"Клиент уже добавлен в группу");
        }

        var client = await clientRepository.GetById(request.ClientId);
        var group = await groupRepository.GetById(request.GroupId);
        var groupMember = new GroupMemberLink()
        {
            Group = group,
            Client = client
        };
        var member = mapper.Map<GroupMemberDto>(await groupMemberRepository.AddAsync(groupMember));
        member.Membership = await membershipService.GetActualMembership(null, request.ClientId);
        return member;
    }
}