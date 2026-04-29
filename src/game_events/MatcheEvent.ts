import { addEvent } from "@/state/useEventStates";
import type { IEvent } from "./IEvent";
import db from "@/../db/db";
import { simulateGoals } from "@/lib/utils/poisson";

const hourInMs = 60 * 60 * 1000;

export default class MatcheEvent implements IEvent {

    async dispatch(dateTime: Date) {
        

        const date = new Date(dateTime.getTime() + hourInMs); 
        const matches = await db.table('match').where('date').equals(date.toISOString().slice(0, 19)).toArray();

        if (matches.length > 0) {
            console.log(matches);
            addEvent("Matches");
        }

        const datet = new Date(dateTime.getTime() - 2 * hourInMs); 
        const matchest = await db.table('match').where('date').equals(datet.toISOString().slice(0, 19)).toArray();
        if (matchest.length > 0) {
            await this.symulateMatch(matchest);
            addEvent("Matches");
        }

    }

    async symulateMatch(matches: {id: number, homeClubId: number, awayClubId: number}[]) {
        await db.transaction('rw', db.table('match'), async () => {
            await Promise.all(matches.map(async (match) => {
                await db.table('match').update(match.id, {
                    homeGoals: simulateGoals(1.65),
                    awayGoals: simulateGoals(1.20),
                    status: 'played',
                });
            }));
        });
    }

}