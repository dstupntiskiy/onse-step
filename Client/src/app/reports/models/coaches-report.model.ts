import { CoachModel } from "../../shared/models/coach-model";

export class CoachWithEventsDto{
    coach: CoachModel
    eventWithParticipants: EventWithParticipantsDto[]
}

export class EventWithParticipantsDto{
    name: string
    startDate: Date
    membershipsCount: number
    onetimeVisitsCount: number
    participantsCount: number
}