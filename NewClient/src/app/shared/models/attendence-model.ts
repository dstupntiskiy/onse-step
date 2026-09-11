import { Client } from "./client-model";
import { MembershipWithDetails } from "./membership-model";

export class Attendence{
    client: Client;
    isAttendant: boolean;
    groupMemberId?: string;
    membership?: MembershipWithDetails
    
    constructor() {}
}