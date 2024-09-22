import { Client } from "./client-model"
import { StyleModel } from "./style-model"

export class MembershipModel{
    amount: number
    comment?: string
    visitsNumber?: number
    startDate: Date
    endDate: Date
    client: Client
    style?: StyleModel
    id: string
    unlimited: boolean
    expired: boolean
    discount: number

    constructor(){}

}

export class MembershipWithDetails extends MembershipModel{
    visited: number

    constructor(){
        super()
    }

    Map(membership: MembershipModel): MembershipWithDetails{
        Object.assign(this, {...membership})
        return this
    }
}