import { Client } from "./client-model";
import { PaymentModel } from "./payment-model";

export class OnetimeVisitorModel{
    id: string;
    client: Client;
    payment: PaymentModel;

    constructor(){}
}