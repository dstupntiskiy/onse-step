using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Entities;

namespace Scheduler.Application.Commands.Groups.GroupSave;

    public class CommandHandler(IRepository<Group> groupRepository, IMapper mapper) : IRequestHandler<Command, GroupDto>
    {
        public async Task<GroupDto> Handle(Command request, CancellationToken cancellationToken)
        {

            var group = await groupRepository.GetById(request.Id);
            group = group ?? new Group();

            group.Name = request.Name;
            group.Style = request.Style;

            if (groupRepository.Query().Any(x => x.Name.Equals(group.Name) && x.Id != request.Id))
            {
                throw new ValidationException($"Группа с именем {group.Name} уже существует");
            }

            var result = await groupRepository.AddAsync(group);

            return mapper.Map<GroupDto>(result);
        }
    }
