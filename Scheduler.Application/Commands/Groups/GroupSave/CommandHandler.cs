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
        IMapper mapper) : IRequestHandler<Command, GroupDto>
    {
        public async Task<GroupDto> Handle(Command request, CancellationToken cancellationToken)
        {

            var group = await groupRepository.GetById(request.Id)!;
            group = group ?? new Group();

            var style = await styleRepository.GetById(request.StyleId)!;

            group.Name = request.Name;
            group.Style = style;
            group.Active = request.Active;
            group.StartDate = request.StartDate;
            group.EndDate = request.EndDate?.Date.AddDays(1).AddSeconds(-1);

            if (groupRepository.Query().Any(x => x.Name.Equals(group.Name) && x.Id != request.Id))
            {
                throw new ValidationException($"Группа с именем {group.Name} уже существует");
            }

            var result = await groupRepository.AddAsync(group);

            return mapper.Map<GroupDto>(result);
        }
    }
