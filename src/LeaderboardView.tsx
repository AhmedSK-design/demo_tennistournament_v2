import type { TurnierResponse, LocalPlayer } from "./main/JS_Objects/types";
import "./App.css";

interface LeaderboardProps {
    plan: TurnierResponse;
    allPlayers: LocalPlayer[];
    onBack: () => void;
}

interface RankingEntry {
    playerId: number;
    name: string;
    totalPoints: number;
    matchesPlayed: number;
    won: number;
    draw: number;
    lost: number;
    gameDifference: number; 
}

export default function LeaderboardView({ plan, allPlayers, onBack }: LeaderboardProps) {

    const calculateRanking = (): RankingEntry[] => {
        const statsMap = new Map<number, RankingEntry>();

        // 1. Initialisieren
        allPlayers.forEach(p => {
            statsMap.set(p.id, {
                playerId: p.id,
                name: p.name,
                totalPoints: 0,
                matchesPlayed: 0,
                won: 0,
                draw: 0,
                lost: 0,
                gameDifference: 0
            });
        });

        // Hilfsfunktion: Wandelt alles sicher in eine Zahl um oder gibt null zurück
        const getSafeScore = (val: any): number | null => {
            if (val === undefined || val === null || val === "") return null;
            const num = Number(val);
            return isNaN(num) ? null : num;
        };

        // 2. Durch alle Runden und Matches loopen
        plan.runden.forEach(runde => {
            runde.matches.forEach(match => {
                
                // Wir holen uns die Scores mit der sicheren Funktion
                const s1 = getSafeScore(match.scoreTeam1);
                const s2 = getSafeScore(match.scoreTeam2);

                // Nur berechnen, wenn BEIDE Scores gültige Zahlen sind
                if (s1 !== null && s2 !== null) {

                    const updateStats = (pId: number, points: number, result: 'win'|'loss'|'draw', diff: number) => {
                        const current = statsMap.get(pId);
                        if (current) {
                            current.matchesPlayed += 1;
                            current.totalPoints += points;
                            current.gameDifference += diff;
                            if (result === 'win') current.won += 1;
                            if (result === 'loss') current.lost += 1;
                            if (result === 'draw') current.draw += 1;
                        }
                    };

                    let p1Points = 0, p2Points = 0;
                    let r1: 'win'|'loss'|'draw' = 'draw';
                    let r2: 'win'|'loss'|'draw' = 'draw';

                    if (s1 > s2) {
                        p1Points = 3; r1 = 'win'; r2 = 'loss';
                    } else if (s2 > s1) {
                        p2Points = 3; r2 = 'win'; r1 = 'loss';
                    } else {
                        p1Points = 1; p2Points = 1; r1 = 'draw'; r2 = 'draw';
                    }

                    const diff1 = s1 - s2;
                    const diff2 = s2 - s1;

                    // Team 1 updaten
                    updateStats(match.team1.spieler1.id, p1Points, r1, diff1);
                    updateStats(match.team1.spieler2.id, p1Points, r1, diff1);

                    // Team 2 updaten
                    updateStats(match.team2.spieler1.id, p2Points, r2, diff2);
                    updateStats(match.team2.spieler2.id, p2Points, r2, diff2);
                }
            });
        });

        // 3. Sortieren
        return Array.from(statsMap.values()).sort((a, b) => {
            if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
            if (b.gameDifference !== a.gameDifference) return b.gameDifference - a.gameDifference;
            return b.won - a.won;
        });
    };

    const ranking = calculateRanking();

    return (
        <div className="tournament-container">
            <div className="header">
                <h1>🏆 Rangliste 🏆</h1>
            </div>

            <div className="rounds-scroll-container">
                <div className="leaderboard-list">
                    {ranking.map((entry, index) => (
                        <div key={entry.playerId} className={`leaderboard-card rank-${index + 1}`}>
                            <div className="rank-badge">{index + 1}.</div>
                            <div className="player-info">
                                <span className="player-name-large">{entry.name}</span>
                                <span className="matches-info">
                                    Spiele: {entry.matchesPlayed} | {entry.won} S - {entry.draw} U - {entry.lost} N
                                </span>
                            </div>
                            <div className="total-points">
                                {entry.totalPoints} <small>Pkt</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="button-bottom-container">
                <button className="back-btn" onClick={onBack}>Zurück zum Plan</button>
            </div>
        </div>
    );
}