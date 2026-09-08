import { Client } from "./client-model";
import { Group } from "./group-model";
import { MembershipWithDetails } from "./membership-model";

export class GroupMember{
    id: string;
    group: Group;
    member: Client;
    membership?: MembershipWithDetails;

    constructor(){}
}