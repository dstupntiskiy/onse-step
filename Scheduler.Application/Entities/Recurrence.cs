using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Scheduler.Entities.Base;

namespace Scheduler.Entities;

[Serializable]
public class Recurrence : AuditableEntity
{
    private string daysOfWeekJson { get; set; }
    private string exceptDatesJson { get; set; }
    public virtual required DateTime? StartDate { get; set; }
    public virtual required DateTime? EndDate { get; set; }
    
    [NotMapped]
    public virtual required DayOfWeek[]? DaysOfWeek { 
        get => daysOfWeekJson == null ? null : JsonConvert.DeserializeObject<DayOfWeek[]>(daysOfWeekJson)      
        ; set => daysOfWeekJson = value == null ? null : JsonConvert.SerializeObject(value); }
    [NotMapped]
    public virtual DateOnly[]? ExceptDates { 
        get => exceptDatesJson == null ? null : JsonConvert.DeserializeObject<DateOnly[]>(exceptDatesJson); 
        set => exceptDatesJson = value == null ? null : JsonConvert.SerializeObject(value
        ); }
    
    public virtual string? DaysOfWeekJson
    {
        get => daysOfWeekJson;
        set => daysOfWeekJson = value;
    }

    public virtual string? ExceptDatesJson
    {
        get => exceptDatesJson;
        set => exceptDatesJson = value;
    }
}