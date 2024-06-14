export class Group{
    id: string;
    name?: string;
    style?: string;
}

export class GroupWithDetails extends Group{
    membersCount: number;
    payedCount: number
}