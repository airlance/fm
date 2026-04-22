import { db } from "@/../mocks/db";
import type { IEvent } from "./IEvent";
import nextDateTime from "@/lib/date/nextDateTime";

export default class StartSeasonEvent implements IEvent {

    async dispatch(dateTime: Date) {
        if (dateTime.getTime() == new Date('2024-06-01T13:00:00').getTime()) {
            console.log("Season has started!");

            const leguaId = db.competition.findFirst(c => c.where({name: 'Seria A'}))?.id;

            if (!leguaId) {
                console.error("Legua not found!");
                return;
            }

            const clubIds = db.competitionClub.findMany(c => c.where({competitionId: leguaId}))
                .map(cc => cc.clubId);

            const numClubs = clubIds.length;
            const numRounds = (numClubs - 1) * 2;

            for (let round = 0; round < numRounds; round++) {           
                let date = nextDateTime(new Date('2024-06-01T13:00:00'), round * 7 * 24);
                for (let i = 0; i < numClubs / 2; i++) {
                    db.matches.create({
                        homeClubId: clubIds[i],
                        awayClubId: clubIds[numClubs - 1 - i],
                        date: date.toISOString().split('T')[0],
                        time: '16:00',
                        competitionId: leguaId,
                    });
                }
            }

        }
    }

}