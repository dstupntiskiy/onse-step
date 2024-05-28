import { Client } from "./client-model";
import { Group } from "./group-model";

export class GroupMember{
    id: string;
    group: Group;
    member: Client;
}