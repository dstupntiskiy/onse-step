import { Client } from "./client-model"

export class MembershipModel{
    amount: number
    comment?: string
    visitsNumber: number
    startDate: Date
    endDate: Date
    client: Client

    constructor(){}
}

export class MembershipWithDetails extends MembershipModel{
    visited: number

    constructor(){
        super()
    }
}