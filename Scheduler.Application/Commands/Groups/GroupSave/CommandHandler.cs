using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Commands.Groups.GroupSave;

    public class CommandHandler(
        IRepository<Group> groupRepository,
        IRepository<Style> styleRepository,
        IRepository<Client> clientRepository,
        IGroupWriter groupWriter,
        IMapper mapper) : IRequestHandler<Command, GroupDto>
    {
        public async Task<GroupDto> Handle(Command request, CancellationToken cancellationToken)
        {

            if (request.StartDate == default || request.EndDate?.Date < request.StartDate.Date)
                throw new ValidationException("Укажите корректные даты группы");

            if (request.MemberIds != null && request.Id != Guid.Empty)
                throw new ValidationException("Состав копии можно указать только при создании новой группы");

            var style = await styleRepository.GetById(request.StyleId)!
                ?? throw new ValidationException("Направление не найдено");

            if (groupRepository.Query().Any(x => x.Name.Equals(request.Name) && x.Id != request.Id))
                throw new ValidationException($"Группа с именем {request.Name} уже существует");

            var clients = new List<Client>();
            foreach (var clientId in request.MemberIds?.Distinct() ?? Enumerable.Empty<Guid>())
            {
                clients.Add(await clientRepository.GetById(clientId)!
                    ?? throw new ValidationException("Участник группы не найден"));
            }

            var group = request.Id == Guid.Empty ? new Group()
                : await groupRepository.GetById(request.Id)! ?? new Group();

            group.Name = request.Name;
            group.Style = style;
            group.Active = request.Active;
            group.StartDate = request.StartDate;
            group.EndDate = request.EndDate?.Date.AddDays(1).AddSeconds(-1);

            var result = request.MemberIds == null
                ? await groupRepository.AddAsync(group)
                : await groupWriter.SaveNewWithMembers(group, clients, cancellationToken);

            return mapper.Map<GroupDto>(result);
        }
    }
