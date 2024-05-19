using System.ComponentModel.DataAnnotations;
using MediatR;
using Scheduler.Application.Interfaces;
using Scheduler.Entities;

namespace Scheduler.Application.Commands.Groups.GroupSave;

    public class CommandHandler(IRepository<Group> groupRepository) : IRequestHandler<Command, Guid>
    {
        public async Task<Guid> Handle(Command request, CancellationToken cancellationToken)
        {
            var group = new Group()
            {
                Name = request.Name,
                Style = request.Style
            };

            if (groupRepository.Query().Any(x => x.Name.Equals((group.Name))))
            {
                throw new ValidationException($"Группа с именем {group.Name} уже существует");
            }

            var result = await groupRepository.AddAsync(group);

            return result.Id;
        }
    }
