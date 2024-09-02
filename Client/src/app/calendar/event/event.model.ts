import { CoachModel } from "../../shared/models/coach-model"
import { Group } from "../../shared/models/group-model"
import { Recurrence } from "../event-dialog/event-dialog.component"

export enum EventType{
  event = 0,
  rent = 1,
  specialEvent = 2
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
  