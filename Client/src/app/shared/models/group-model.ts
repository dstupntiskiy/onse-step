export class Group{
    id: string
    name?: string
    style?: string
    active: boolean

    constructor(){}
}

export class GroupWithDetails extends Group{
    membersCount: number;
    payedCount: number
}