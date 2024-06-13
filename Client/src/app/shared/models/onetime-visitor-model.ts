import { Participant } from "./participant-model";
import { PaymentModel } from "./payment-model";

export class OnetimeVisitorModel{
    id: string;
    client: Participant;
    payment: PaymentModel;

    constructor(){}
}