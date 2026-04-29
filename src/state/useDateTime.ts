import { create } from "zustand";
import nextDateTime from "@/lib/date/nextDateTime";
import Dispatcher from "@/game_events/dispatcher";
import { clearEvents, useEventStates } from "./useEventStates";
import { globalNavigate } from "@/providers/RouterProvider";

type DateTimeState = {
    dateTime: Date;
    processing: boolean;
};

export const useDateTime = create<DateTimeState>(() => {
    return {
        dateTime: new Date('2025-06-29T12:00:00'),
        processing: false,
    };
});

const dispatcher = new Dispatcher();

export async function nextDateTimeAction() {
    const currentDate = useDateTime.getState().dateTime;
    const newDate = nextDateTime(currentDate);
    const eventStates = useEventStates.getState().events;

    useDateTime.setState(() => ({processing: true, dateTime: newDate}));

    await dispatcher.dispatch(newDate);

    if (eventStates.length == 0) {
        nextDateTimeAction();
    } else {
        if (eventStates.includes("Matches")) {
            console.log("Navigating to matches...");
            globalNavigate("/matches");
        }
        clearEvents();
        useDateTime.setState({ processing: false });
    }
}