using MediatR;
using Scheduler.Application.Common.Dtos;

namespace Scheduler.Application.Commands.Clients.ClientSave;

public class Command(Guid id, string name, string? phone, string? socialMediaLink) : IRequest<ClientDto>
{
    public Guid Id { get; } = id;
    public string Name { get; } = name;
    public string? Phone { get; } = phone;
    public string? SocialMediaLink { get; } = socialMediaLink;
}