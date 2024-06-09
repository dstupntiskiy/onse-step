import { Participant } from "./participant-model";

export class Attendence{
    client: Participant;
    isAttendant: boolean;
    groupMemberId?: string;

    constructor() {}
}