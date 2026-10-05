using System.ComponentModel.DataAnnotations;
using System.Reflection;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using NHibernate;
using Scheduler.Application.Commands.Groups.GroupSave;
using Scheduler.Application.Entities;
using Scheduler.Application.Entities.Base;
using Scheduler.Application.Interfaces;
using Scheduler.Infrastructure.Repository;

internal static class GroupCopyChecks
{
    public static async Task Run(IServiceProvider services)
    {
        var style = new Style { Id = Guid.NewGuid(), Name = "Bachata" };
        var source = new Group { Id = Guid.NewGuid(), Name = "Original", Style = style,
            StartDate = new DateTime(2026, 9, 1), EndDate = new DateTime(2026, 9, 30), Active = true };
        var client = new Client { Id = Guid.NewGuid(), Name = "Participant" };
        var groups = new MemoryRepository<Group>([source]);
        var writer = new RecordingWriter(groups);
        var handler = new CommandHandler(groups, new MemoryRepository<Style>([style]),
            new MemoryRepository<Client>([client]), writer, services.GetRequiredService<IMapper>());
        var command = new Command(Guid.Empty, "Original - copy", style.Id, true,
            new DateTime(2026, 10, 1), null, [client.Id, client.Id]);

        var result = await handler.Handle(command, default);
        Check(result.Id != source.Id && result.Name == "Original - copy", "A copy has a new identity.");
        Check(result.Style.Id == style.Id && result.EndDate == null && result.StartDate == command.StartDate,
            "The copy uses the submitted style and dates, including an empty end date.");
        Check(writer.Clients.Single().Id == client.Id, "Duplicate participant IDs are saved only once.");
        Check(source.Name == "Original" && source.StartDate.Month == 9, "The source is unchanged.");

        var count = groups.Items.Count;
        foreach (var invalid in new[] {
            command,
            command with { Name = "Missing client", MemberIds = [Guid.NewGuid()] },
            command with { Name = "Missing style", StyleId = Guid.NewGuid() },
            command with { Name = "Missing date", StartDate = default },
            command with { Name = "Wrong dates", EndDate = command.StartDate.AddDays(-1) },
            command with { Id = source.Id, Name = "Changed original" }
        })
        {
            try
            {
                await handler.Handle(invalid, default);
                throw new Exception("Invalid copy was accepted.");
            }
            catch (ValidationException) { }
            Check(groups.Items.Count == count && writer.Calls == 1, "Invalid input must not write a group.");
        }

        await handler.Handle(command with { Name = "Empty copy", MemberIds = [] }, default);
        Check(writer.Clients.Count == 0, "A group with no participants can be copied.");
        await handler.Handle(command with { Name = "Ordinary new group", MemberIds = null }, default);
        Check(writer.Calls == 2, "Ordinary creation retains its existing save path.");
        await handler.Handle(command with { Id = source.Id, Name = "Updated original", MemberIds = null }, default);
        Check(source.Name == "Updated original" && writer.Calls == 2, "Ordinary editing still updates the original.");

        await CheckTransaction(client, false);
        await CheckTransaction(client, true);
        Console.WriteLine("PASS: Group copies preserve the source, validate drafts, deduplicate members and save atomically.");
    }

    private static async Task CheckTransaction(Client client, bool failMember)
    {
        var committed = false;
        var rolledBack = false;
        var saved = new List<AuditableEntity>();
        var transaction = CallProxy.Create<ITransaction>((method, _) => method.Name switch
        {
            "CommitAsync" => Complete(() => committed = true),
            "RollbackAsync" => Complete(() => rolledBack = true),
            "Dispose" => null,
            _ => throw new NotSupportedException(method.Name)
        });
        var session = CallProxy.Create<ISession>((method, args) =>
        {
            if (method.Name == "BeginTransaction") return transaction;
            if (method.Name != "SaveAsync") throw new NotSupportedException(method.Name);
            var entity = (AuditableEntity)args![0]!;
            if (failMember && entity is GroupMemberLink)
                return Task.FromException<object>(new InvalidOperationException("Simulated storage failure"));
            entity.Id = Guid.NewGuid();
            saved.Add(entity);
            return Task.FromResult<object>(entity.Id);
        });
        var group = new Group();
        try
        {
            await new GroupWriter(session, new CurrentUser()).SaveNewWithMembers(group, [client], default);
            Check(!failMember, "Storage failure must propagate.");
        }
        catch (InvalidOperationException) when (failMember) { }
        Check(committed == !failMember && rolledBack == failMember,
            "A member write failure rolls back the entire copy instead of committing a partial group.");
        if (!failMember)
        {
            var link = saved.OfType<GroupMemberLink>().Single();
            Check(link.Group == group && link.Client == client, "New links point to the copy and original clients.");
            Check(saved.All(entity => entity.CreatedBy == "test-user" && entity.CreateDate != null),
                "Groups and participant links retain audit data.");
        }
    }

    private static Task Complete(Action action) { action(); return Task.CompletedTask; }
    private static void Check(bool condition, string message) { if (!condition) throw new Exception(message); }

    private sealed class CurrentUser : ICurrentUserService { public string UserId => "test-user"; }

    private sealed class RecordingWriter(MemoryRepository<Group> groups) : IGroupWriter
    {
        public int Calls { get; private set; }
        public IReadOnlyCollection<Client> Clients { get; private set; } = [];
        public Task<Group> SaveNewWithMembers(Group group, IReadOnlyCollection<Client> clients, CancellationToken token)
        {
            Calls++;
            Clients = clients;
            return groups.AddAsync(group);
        }
    }

    private sealed class MemoryRepository<T>(List<T> items) : IRepository<T> where T : AuditableEntity
    {
        public List<T> Items => items;
        public IQueryable<T> Query() => items.AsQueryable();
        public Task<T> GetById(Guid id) => Task.FromResult(items.SingleOrDefault(entity => entity.Id == id)!);
        public Task<List<T>> GetAll() => Task.FromResult(items);
        public Task<T> AddAsync(T entity)
        {
            if (entity.Id == Guid.Empty) { entity.Id = Guid.NewGuid(); items.Add(entity); }
            return Task.FromResult(entity);
        }
        public Task<T> UpdateAsync(T entity, CancellationToken token) => throw new NotSupportedException();
        public Task DeleteAsync(Guid id, CancellationToken token) => throw new NotSupportedException();
    }

    public class CallProxy : DispatchProxy
    {
        private Func<MethodInfo, object?[]?, object?> callback = null!;
        public static T Create<T>(Func<MethodInfo, object?[]?, object?> callback) where T : class
        {
            var proxy = Create<T, CallProxy>();
            ((CallProxy)(object)proxy).callback = callback;
            return proxy;
        }
        protected override object? Invoke(MethodInfo? method, object?[]? args) => callback(method!, args);
    }
}
