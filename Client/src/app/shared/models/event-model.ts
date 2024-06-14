export class EvenExtendedProps{
    groupdId: string;
    coachId: string;
}

export class EventBase{
    title: string;
    id: string;
    extendedProps?: EvenExtendedProps;
}

export class SimpleEvent extends EventBase{
    start: string;
    end: string;
}