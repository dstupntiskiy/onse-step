import { Client } from "./client-model"
import { StyleModel } from "./style-model"

export class MembershipModel{
    amount: number
    comment?: string
    visitsNumber: number
    startDate: Date
    endDate: Date
    client: Client
    style: StyleModel
    id: string

    constructor(){}
}

export class MembershipWithDetails extends MembershipModel{
    visited: number

    constructor(){
        super()
    }
}