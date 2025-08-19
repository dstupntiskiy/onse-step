namespace Scheduler.Application.Common.Dtos;

public class StyleDto : EntityDto
{
    public string Name { get; set; }
    public decimal BasePrice { get; set; }
    public decimal SecondaryPrice { get; set; }
    public decimal OnetimeVisitPrice { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal BonusSalary { get; set; }
    public bool Active { get; set; }
}