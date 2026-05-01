import nextDateTime from "@/lib/date/nextDateTime";
import type { IEvent } from "./IEvent";
import db from "@/../db/db";

export default class DrawEvent implements IEvent {

    async dispatch(dateTime: Date) {
        const draws = await db.table('draw').where('date').equals(dateTime.toISOString().slice(0, 19)).toArray();
        for (const draw of draws) {
            await this.createSeasonSchedule(draw);
        }
    }

    private async createSeasonSchedule(draw: {seasonId: number}) {
        const clubIds = (await db.table('seasonClub').where('seasonId').equals(draw.seasonId).toArray()).map(c => c.clubId || 0);

        const numClubs = clubIds.length;
        if (numClubs < 2 || numClubs % 2 !== 0) return;

        const firstLegRounds = numClubs - 1;
        const numRounds = (numClubs - 1) * 2;
        const firstLegPairs: { homeClubId: number; awayClubId: number }[][] = [];

        const rotatingClubs = [...clubIds];
        const fixedClubId = rotatingClubs[0];

        for (let round = 0; round < firstLegRounds; round++) {
            const roundOrder = [fixedClubId, ...rotatingClubs.slice(1)];
            const roundPairs: { homeClubId: number; awayClubId: number }[] = [];

            for (let i = 0; i < numClubs / 2; i++) {
                const leftClubId = roundOrder[i];
                const rightClubId = roundOrder[numClubs - 1 - i];
                const swapHomeAway = round % 2 !== 0;
                const homeClubId = swapHomeAway ? rightClubId : leftClubId;
                const awayClubId = swapHomeAway ? leftClubId : rightClubId;
                roundPairs.push({ homeClubId, awayClubId });
            }

            firstLegPairs.push(roundPairs);

            const lastClubId = rotatingClubs.pop();
            if (lastClubId !== undefined) {
                rotatingClubs.splice(1, 0, lastClubId);
            }
        }

        await db.transaction('rw', [db.table('round'), db.table('match')], async () => {
            for (let round = 0; round < numRounds; round++) {           
                let date = nextDateTime(new Date('2025-06-30T13:00:00'), round * 7 * 24);
                let matches = [];
                
                // Создаем раунд
                let roundId = await db.table('round').add({ 
                    name: `Round ${round + 1}`, 
                    seasonId: draw.seasonId 
                });

                const isSecondLeg = round >= firstLegRounds;
                const sourceRoundPairs = firstLegPairs[round % firstLegRounds] || [];

                for (const pair of sourceRoundPairs) {
                    const homeClubId = isSecondLeg ? pair.awayClubId : pair.homeClubId;
                    const awayClubId = isSecondLeg ? pair.homeClubId : pair.awayClubId;

                    matches.push({
                        homeClubId,
                        awayClubId,
                        date: date.toISOString().slice(0, 19), // обрезаем для красоты
                        roundId: roundId,
                        status: 'scheduled',
                    });
                }
                
                // Добавляем матчи пачкой
                await db.table('match').bulkAdd(matches);
            }
        });
    }
    
}
