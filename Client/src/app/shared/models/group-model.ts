import { StyleModel } from "./style-model";

export class Group{
    id: string
    name: string
    style: StyleModel
    active: boolean
    startDate: Date
    endDate?: Date

    constructor(){
        this.active = true
    }
}

export class GroupWithDetails extends Group{
    membersCount: number;
    payedCount: number
}