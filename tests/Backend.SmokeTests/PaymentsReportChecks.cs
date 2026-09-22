using Microsoft.AspNetCore.Mvc;
using Scheduler.Application.Entities;
using Scheduler.Application.Interfaces;
using Scheduler.Application.Queries.Reports.GetPaymentsReportByPeriod;
using Scheduler.Controllers;

internal static class PaymentsReportChecks
{
    public static async Task Run()
    {
        var start = new DateTime(2026, 8, 31, 22, 0, 0, DateTimeKind.Utc);
        var end = start.AddMonths(1);
        var style = new Style { Id = Guid.NewGuid(), Name = "Bachata" };
        var otherStyle = new Style { Id = Guid.NewGuid(), Name = "Bachata" };
        var visit = new OneTimeVisit { Id = Guid.NewGuid(), Event = new Event
        {
            StartDateTime = start.AddMonths(-1), Group = new Group { Style = style }
        } };
        var rental = new OneTimeVisit { Id = Guid.NewGuid(), Event = new Event() };
        Membership Membership(DateTime? date, decimal amount, Style? direction, bool unlimited = false) => new()
        {
            Id = Guid.NewGuid(), CreateDate = date, Amount = amount, Style = direction,
            StartDate = start.AddMonths(2), Unlimited = unlimited
        };
        OneTimeVisitPayment Payment(DateTime? date, decimal amount, OneTimeVisit item) => new()
        {
            Id = Guid.NewGuid(), CreateDate = date, Amount = amount, OneTimeVisit = item
        };
        var handler = new GetPaymentsReportByPeriodQueryHandler(
            new ReadOnlyRepository<Membership>([
                Membership(start, 6000, style), Membership(end.AddTicks(-1), 9000, null),
                Membership(start, 4000, style, unlimited: true),
                Membership(start.AddDays(1), 0, otherStyle),
                Membership(start.AddTicks(-1), 99999, style), Membership(end, 99999, style),
                Membership(null, 99999, style)
            ]),
            new ReadOnlyRepository<OneTimeVisitPayment>([
                Payment(start.AddHours(1), 700, visit), Payment(start.AddDays(1), 300, visit),
                Payment(end.AddTicks(-1), 2000, rental), Payment(end, 99999, visit),
                Payment(start.AddTicks(-1), 99999, visit), Payment(null, 99999, visit)
            ]));
        var query = new GetPaymentsReportByPeriodQuery(start, end, TimeZoneInfo.FindSystemTimeZoneById("Europe/Belgrade"));
        var report = await handler.Handle(query, default);
        Check(report.TotalAmount == 22000 && report.MembershipAmount == 19000 && report.OnetimeAmount == 3000,
            "Amounts use creation/payment dates and an exclusive end boundary.");
        Check(report.MembershipCount == 4 && report.OnetimeCount == 2, "Split payments count as one visit.");
        var unlimited = report.ByStyle.Single(x => x.Key == "unlimited");
        Check(unlimited.StyleId == null && unlimited.StyleName == "Безлимит" &&
              unlimited.MembershipAmount == 13000 && unlimited.MembershipCount == 2 && unlimited.OnetimeCount == 0,
            "Unlimited memberships with a saved direction and legacy memberships without a direction share a separate row.");
        Check(report.ByStyle.Count == 4 && report.ByStyle[0].Key == "unlimited" && report.ByStyle[2].Key == "rental",
            "Directions sort by combined amount; rental, unlimited and equal names stay separate.");
        var bachata = report.ByStyle.Single(x => x.StyleId == style.Id);
        Check(bachata.TotalAmount == 7000 && bachata.MembershipCount == 1 && bachata.OnetimeCount == 1,
            "Both types merge by style ID.");
        Check(report.ByDate.Select(x => x.Date).SequenceEqual([
            new DateOnly(2026, 9, 1), new DateOnly(2026, 9, 2), new DateOnly(2026, 9, 30)]),
            "Dates sort chronologically in the requested timezone, including the last day's final instant.");
        Check(report.ByDate.Sum(x => x.TotalAmount) == report.TotalAmount &&
              report.ByDate.Sum(x => x.MembershipAmount) == report.MembershipAmount &&
              report.ByDate.Sum(x => x.OnetimeAmount) == report.OnetimeAmount, "All widgets reconcile.");

        var nextPeriod = await handler.Handle(query with { StartDate = end, EndDate = end.AddTicks(1) }, default);
        Check(nextPeriod.TotalAmount == 199998, "The next interval includes the previous exclusive boundary.");
        var empty = await handler.Handle(query with { StartDate = end.AddDays(1), EndDate = end.AddDays(2) }, default);
        Check(empty.TotalAmount == 0 && empty.ByStyle.Count == 0 && empty.ByDate.Count == 0, "Empty period.");

        // Belgrade's DST change must not move late-night payments to the previous day.
        var dstDate = new DateTime(2026, 10, 25, 23, 30, 0, DateTimeKind.Utc);
        var dstHandler = new GetPaymentsReportByPeriodQueryHandler(
            new ReadOnlyRepository<Membership>([Membership(dstDate, 10, style)]),
            new ReadOnlyRepository<OneTimeVisitPayment>([]));
        var dst = await dstHandler.Handle(query with { StartDate = dstDate.Date, EndDate = dstDate.AddDays(1) }, default);
        Check(dst.ByDate.Single().Date == new DateOnly(2026, 10, 26), "DST-aware local calendar dates.");

        var controller = new ReportController(null!);
        Check((await controller.GetPaymentsReportByPeriod(end, start)).Result is BadRequestObjectResult, "Reject reversed dates.");
        Check((await controller.GetPaymentsReportByPeriod(start, end, "invalid-zone")).Result is BadRequestObjectResult,
            "Reject invalid timezones.");
        Console.WriteLine("PASS: Combined payment report totals, counts, boundaries, timezone, grouping and validation.");
    }

    private static void Check(bool condition, string message)
    {
        if (!condition) throw new Exception(message);
    }

    private sealed class ReadOnlyRepository<T>(IEnumerable<T> entities) : IRepository<T>
    {
        public IQueryable<T> Query() => entities.AsQueryable();
        public Task<T>? GetById(Guid id) => throw new NotSupportedException();
        public Task<List<T>> GetAll() => throw new NotSupportedException();
        public Task<T> AddAsync(T entity) => throw new NotSupportedException();
        public Task<T> UpdateAsync(T entity, CancellationToken cancellationToken) => throw new NotSupportedException();
        public Task DeleteAsync(Guid id, CancellationToken cancellationToken) => throw new NotSupportedException();
    }
}
