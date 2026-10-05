using System.ComponentModel.DataAnnotations;
using System.Data;
using NHibernate;
using Scheduler.Application.Entities;
using Scheduler.Application.Enums;
using Scheduler.Application.Interfaces;

namespace Scheduler.Infrastructure.Repository;

public class EventGroupWriter(
    ISession session,
    IRepository<Event> eventRepository,
    IRepository<Group> groupRepository,
    IRepository<EventParticipance> participanceRepository,
    ICurrentUserService currentUserService) : IEventGroupWriter
{
    public async Task<List<Event>> ChangeGroup(Guid eventId, Guid groupId, CancellationToken cancellationToken)
    {
        using var transaction = session.BeginTransaction(IsolationLevel.Serializable);
        try
        {
            var selectedEvent = await eventRepository.GetById(eventId)
                ?? throw new ValidationException("Занятие не найдено");
            if (selectedEvent.EventType != EventType.Event)
                throw new ValidationException("Группу можно изменить только у занятия");

            var group = await groupRepository.GetById(groupId)
                ?? throw new ValidationException("Группа не найдена");
            var events = selectedEvent.Recurrence == null
                ? new List<Event> { selectedEvent }
                : eventRepository.Query()
                    .Where(ev => ev.Recurrence != null && ev.Recurrence.Id == selectedEvent.Recurrence.Id).ToList();

            var changedEvents = events.Where(ev => ev.Group?.Id != group.Id).ToList();
            // Group attendance is stored separately from one-time visits. Never remove either.
            var eventIds = events.Select(ev => ev.Id).ToArray();
            if (changedEvents.Count > 0 && participanceRepository.Query().Any(p => eventIds.Contains(p.Event.Id)))
                throw new ValidationException("Нельзя изменить группу: в занятии или его повторениях есть посещения предыдущей группы");

            foreach (var ev in changedEvents)
            {
                ev.Group = group;
                ev.ModifiedAt = DateTime.Now;
                ev.ModifiedBy = currentUserService.UserId ?? string.Empty;
                await session.UpdateAsync(ev, cancellationToken);
            }

            await transaction.CommitAsync(cancellationToken);
            return events;
        }
        catch
        {
            await transaction.RollbackAsync(CancellationToken.None);
            throw;
        }
    }
}
