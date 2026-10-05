using AutoMapper;
using MediatR;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Interfaces;

namespace Scheduler.Application.Commands.Events.ChangeEventGroup;

public class ChangeEventGroupCommandHandler(IEventGroupWriter writer, IMapper mapper)
    : IRequestHandler<ChangeEventGroupCommand, List<EventDto>>
{
    public async Task<List<EventDto>> Handle(ChangeEventGroupCommand request, CancellationToken cancellationToken)
        => mapper.Map<List<EventDto>>(await writer.ChangeGroup(request.EventId, request.GroupId, cancellationToken));
}
