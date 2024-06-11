import { Client } from "./client-model";
import { Group } from "./group-model";
import { PaymentModel } from "./payment-model";

export class GroupMember{
    id: string;
    group: Group;
    member: Client;
    payment?: PaymentModel;

    constructor(){}
}