import { CoachModel } from "../../shared/models/coach-model";

export class CoachWithEventsDto{
    coach: CoachModel
    eventWithParticipants: EventWithParticipantsDto[]
}

export class EventWithParticipantsDto{
    name: string
    startDate: Date
    membersCount: number
    onetimeVisitsCount: number
    participantsCount: number
    baseSalary: number
    bonusSalary: number
    totalSalary: number
}