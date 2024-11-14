using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Services;

namespace Scheduler.Application.Commands.Memberships.MembershipSave;

public class CommandHandler(IMapper mapper,
    IRepository<Membership> membershipRepository,
    IRepository<Client> clientRepository,
    IRepository<Style> styleRepository,
    MembershipService membershipService) : IRequestHandler<Command, MembershipWithDetailsDto>
{
    public async Task<MembershipWithDetailsDto> Handle(Command request, CancellationToken cancellationToken)
    {
        if (request is { Unlimited: false, VisitsNumber: null } or {StyleId: null, Unlimited: false})
        {
            throw new ValidationException("Количество посещений и направления обязательны для заполнения");
        }
        
        if(membershipRepository.Query().Any(x => ((request.StartDate >= x.StartDate && request.StartDate < x.EndDate)
           || (request.EndDate > x.StartDate && request.EndDate < x.EndDate))
           && x.Style != null && request.StyleId == x.Style.Id
           && x.Client.Id == request.ClientId
           && x.Id != request.Id))
        {
            throw new ValidationException("Уже существует абонемент на эти даты");
        }
        
        var client = await clientRepository.GetById(request.ClientId);
        
        var styleId = request.StyleId ?? Guid.Empty;
        var style = await styleRepository.GetById(styleId);
        
        var membership = await membershipRepository.GetById(request.Id);

        membership = membership ?? new Membership();

        membership.Amount = request.Amount;
        membership.Comment = request.Comment;
        membership.StartDate = request.StartDate;
        membership.EndDate = request.EndDate;
        membership.VisitsNumber = request.VisitsNumber;
        membership.Client = client;
        membership.Style = style;
        membership.Unlimited = request.Unlimited;
        membership.Discount = request.Discount;

        var savedMembership = mapper.Map<MembershipWithDetailsDto>(await membershipRepository.AddAsync(membership));
        (savedMembership.Visited, savedMembership.Expired) = await membershipService.GetVisitedCount(request.ClientId, savedMembership.Id, null);

        return savedMembership;
    }
}