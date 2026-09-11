export class Client{
    id: string;
    name: string;
    phone: string;
    socialMediaLink: string;
    createDate?: Date

    constructor(){}
}

export class ClientOnetimeVisit{
    date: Date
    name: string
}