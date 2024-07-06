import { StyleModel } from "./style-model";

export class Group{
    id: string
    name?: string
    style?: StyleModel
    active: boolean

    constructor(){}
}

export class GroupWithDetails extends Group{
    membersCount: number;
    payedCount: number
}