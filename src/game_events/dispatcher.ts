import type { IEvent } from "./IEvent";
import MatcheEvent from "./MatcheEvent";
import DrawEvent from "./DrawEvent";

export default class Dispatcher implements IEvent {

    private events: IEvent[];

    constructor() {
        this.events = [
            new DrawEvent(),
            new MatcheEvent(),
        ];
    }

    async dispatch(dateTime: Date): Promise<void> {
        return Promise.all(this.events.map(event => event.dispatch(dateTime))).then(() => {});
    }

}