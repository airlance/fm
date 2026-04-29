import db from '@/../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDateTime } from '@/state/useDateTime';
import { useManager } from '@/hooks/useManager';

type GameType = {
    date: Date;
    homeClub: { id: number; name: string };
    awayClub: { id: number; name: string };
    match: { id: number; homeGoals?: number; awayGoals?: number; status: string };
    isManagerGame: boolean;
}; 

export function Page() {

    const dateTime = useDateTime(state => state.dateTime);

    const manager = useManager();

    const games = useLiveQuery<GameType[]>(
        async () => {
            const matches = await db.table('match').where('date').between(
                new Date(dateTime.getTime() - 5 * 60 * 60 * 1000).toISOString().slice(0, 19), 
                new Date(dateTime.getTime() + 5 * 60 * 60 * 1000).toISOString().slice(0, 19)
            ).toArray();
            // .equals(dateTime.toISOString().slice(0, 19)).toArray();
            
            const games = await Promise.all(matches.map(async (match) => {
                const [homeClub, awayClub] = await Promise.all([
                    db.table('club').get(match.homeClubId),
                    db.table('club').get(match.awayClubId)
                ]);
                return {
                    date: new Date(match.date),
                    homeClub,
                    awayClub,
                    match: match,
                    isManagerGame: match.homeClubId === manager?.clubId || match.awayClubId === manager?.clubId,
                };
            }));
            return games;
        }, [dateTime, manager?.clubId]
    );

    if (games == undefined) {
        return <>Loading...</>
    }

    if (games.length === 0) {
        return <>No games today</>
    }

    return (
        <div>
            {games.map(game => (
                <div key={game.match.id}>
                    <div className='flex gap-4'>
                        <div className='w-8'>
                            {`${String(game.date.getHours()).padStart(2, '0')}:${String(game.date.getMinutes()).padStart(2, '0')}`}
                        </div>
                        <div className='w-8'>3th</div>
                        <div className={`w-40 ${game.isManagerGame && game.homeClub.id === manager?.clubId ? " text-blue-500" : ""}`}>
                            {game.homeClub.name}
                        </div>
                        <div className='w-16'>{game.match.status === 'played' ? `${game.match.homeGoals} - ${game.match.awayGoals}` : 'vs'}</div>
                        <div className={`w-40 ${game.isManagerGame && game.awayClub.id === manager?.clubId ? "bg-blue-500 text-white" : ""}`}>
                            {game.awayClub.name}
                        </div> 
                        <div className='w-8'>4th</div>
                    </div>
                </div>
            ))}
        </div>
    )
}