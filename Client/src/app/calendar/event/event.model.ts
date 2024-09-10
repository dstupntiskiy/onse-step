import { CoachModel } from "../../shared/models/coach-model"
import { Group } from "../../shared/models/group-model"
import { Recurrence } from "../event-dialog/event-dialog.component"

export enum EventType{
  Event = 0,
  Rent = 1,
  SpecialEvent = 2
}

export class EventModel{
    id: string
    startDateTime: Date
    endDateTime: Date
    name: string
    color?: string
    group?: Group
    recurrence?: Recurrence
    coach?: CoachModel
    eventType: EventType

    constructor(){}
  }

export class EventCoachSubstitutionModel{
  id: string
  coach: CoachModel
}
  