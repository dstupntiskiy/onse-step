using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Memberships.MembershipSave;

public class CommandHandler(IMapper mapper,
    IRepository<Membership> membershipRepository,
    IRepository<Client> clientRepository,
    IRepository<Style> styleRepository) : IRequestHandler<Command, MembershipDto>
{
    public async Task<MembershipDto> Handle(Command request, CancellationToken cancellationToken)
    {
        var client = await clientRepository.GetById(request.ClientId);
        var style = await styleRepository.GetById(request.StyleId);
        var membership = await membershipRepository.GetById(request.Id);

        membership = membership ?? new Membership();

        membership.Amount = request.Amount;
        membership.Comment = request.Comment;
        membership.StartDate = request.StartDate;
        membership.EndDate = request.EndDate;
        membership.VisitsNumber = request.VisitsNumber;
        membership.Client = client;
        membership.Style = style;

        return mapper.Map<MembershipDto>(await membershipRepository.AddAsync(membership));
    }
}