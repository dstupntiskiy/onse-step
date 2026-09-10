namespace Scheduler.Application.Common.Dtos.Reports;

public record PaymentAmountsDto(decimal MembershipAmount, decimal OnetimeAmount)
{
    public decimal TotalAmount => MembershipAmount + OnetimeAmount;
}

public record PaymentsByStyleDto(
    string Key, Guid? StyleId, string StyleName,
    decimal MembershipAmount, decimal OnetimeAmount,
    int MembershipCount, int OnetimeCount) : PaymentAmountsDto(MembershipAmount, OnetimeAmount)
{
    public int TotalCount => MembershipCount + OnetimeCount;
}

public record PaymentsByDateDto(DateOnly Date, decimal MembershipAmount, decimal OnetimeAmount)
    : PaymentAmountsDto(MembershipAmount, OnetimeAmount);

public record PaymentsReportDto(
    decimal MembershipAmount, decimal OnetimeAmount,
    int MembershipCount, int OnetimeCount,
    List<PaymentsByStyleDto> ByStyle, List<PaymentsByDateDto> ByDate)
    : PaymentAmountsDto(MembershipAmount, OnetimeAmount);
