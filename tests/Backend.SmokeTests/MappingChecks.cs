using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Scheduler.Application.Common.Dtos;
using Scheduler.Application.Entities;

internal static class MappingChecks
{
    public static void Run(IServiceProvider services)
    {
        // Resolve the production registration: duplicate profiles and missing nested maps
        // must fail here, rather than on the first authenticated request.
        var mapper = services.GetRequiredService<IMapper>();
        var style = new Style { Id = Guid.NewGuid(), Name = "Bachata", BasePrice = 6000 };
        var group = new Group
        {
            Id = Guid.NewGuid(), Name = "Evening", Style = style, Active = true,
            StartDate = new DateTime(2026, 9, 1), EndDate = new DateTime(2026, 10, 1)
        };
        var groupDto = mapper.Map<GroupDto>(group);
        Check(groupDto.Id == group.Id && groupDto.Name == group.Name && groupDto.Active &&
              groupDto.Style.Id == style.Id && groupDto.StartDate == group.StartDate &&
              groupDto.EndDate == group.EndDate, "Group mapping preserves fields.");

        var coach = new Coach { Id = Guid.NewGuid(), Name = "Coach", Style = style };
        var lesson = new Event
        {
            Id = Guid.NewGuid(), Name = "Lesson", Group = group, Coach = coach,
            StartDateTime = group.StartDate.AddHours(18), EndDateTime = group.StartDate.AddHours(19)
        };
        var eventDto = mapper.Map<EventDto>(lesson);
        Check(eventDto.Id == lesson.Id && eventDto.StartDateTime == lesson.StartDateTime &&
              eventDto.Group?.Style.Name == style.Name && eventDto.Coach?.Id == coach.Id,
            "Event mapping preserves nested group, style and coach projections.");

        var membership = new Membership
        {
            Id = Guid.NewGuid(), Amount = 6000, Unlimited = true, Style = null,
            Client = new Client { Id = Guid.NewGuid(), Name = "Client" },
            StartDate = group.StartDate, EndDate = group.EndDate.Value
        };
        var membershipDto = mapper.Map<MembershipWithDetailsDto>(membership);
        Check(membershipDto.Id == membership.Id && membershipDto.Amount == 6000 &&
              membershipDto.Unlimited && membershipDto.Style == null &&
              membershipDto.Client.Id == membership.Client.Id,
            "Unlimited memberships retain their client and nullable style.");

        // Regression for CVE-2026-32933: building the graph is iterative so only
        // the mapper's recursion protection is exercised.
        var configuration = new MapperConfiguration(cfg => cfg.CreateMap<DeepSource, DeepDestination>(),
            NullLoggerFactory.Instance);
        var root = new DeepSource();
        var current = root;
        for (var i = 0; i < 30000; i++) current = current.Child = new DeepSource();
        var mapped = configuration.CreateMapper().Map<DeepDestination>(root);
        var depth = 0;
        for (var item = mapped; item != null; item = item.Child) depth++;
        Check(depth > 0 && depth < 30000, "Deep object graphs are bounded without crashing the process.");
        Console.WriteLine("PASS: AutoMapper production mappings and recursion protection.");
    }

    private static void Check(bool condition, string message)
    {
        if (!condition) throw new Exception(message);
    }

    public sealed class DeepSource
    {
        public DeepSource? Child { get; set; }
    }

    public sealed class DeepDestination
    {
        public DeepDestination? Child { get; set; }
    }
}
