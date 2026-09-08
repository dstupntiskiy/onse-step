export class EventDutyReport{
    name: string
    totalHours: number
    eventDutyDetails: EventDutyReportDetail[]
}

export class EventDutyReportDetail{
    startDate: Date
    endDate: Date
}