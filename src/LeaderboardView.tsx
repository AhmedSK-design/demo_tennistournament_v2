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
    totalPoints: number;    // Hier: Summe der gewonnenen Spiele (Games)
    matchesPlayed: number;
    won: number;
    draw: number;
    lost: number;
}

export default function LeaderboardView({ plan, onBack }: LeaderboardProps) {

    const calculateRanking = (): RankingEntry[] => {
        const statsMap = new Map<number, RankingEntry>();

        // 1. Alle Spieler aus dem Plan laden (damit die IDs stimmen)
        const ensurePlayerExists = (p: { id: number, name: string }) => {
            if (!statsMap.has(p.id)) {
                statsMap.set(p.id, {
                    playerId: p.id,
                    name: p.name,
                    totalPoints: 0,
                    matchesPlayed: 0,
                    won: 0,
                    draw: 0,
                    lost: 0
                });
            }
        };

        // Spieler registrieren
        plan.runden.forEach(runde => {
            runde.matches.forEach(match => {
                ensurePlayerExists(match.team1.spieler1);
                ensurePlayerExists(match.team1.spieler2);
                ensurePlayerExists(match.team2.spieler1);
                ensurePlayerExists(match.team2.spieler2);
            });
        });

        // Hilfsfunktion zum sicheren Lesen der Zahlen
        const getSafeScore = (val: any): number | null => {
            if (val === undefined || val === null || val === "") return null;
            const num = Number(val);
            return isNaN(num) ? null : num;
        };

        // 2. Punkte berechnen (Einfache Summe der Games)
        plan.runden.forEach(runde => {
            runde.matches.forEach(match => {
                const s1 = getSafeScore(match.scoreTeam1);
                const s2 = getSafeScore(match.scoreTeam2);

                if (s1 !== null && s2 !== null) {

                    // Funktion zum Updaten eines Spielers
                    const updateStats = (pId: number, gamesScored: number, result: 'win'|'loss'|'draw') => {
                        const current = statsMap.get(pId);
                        if (current) {
                            current.matchesPlayed += 1;
                            current.totalPoints += gamesScored; // <--- HIER: Einfach die Games addieren!
                            
                            if (result === 'win') current.won += 1;
                            if (result === 'loss') current.lost += 1;
                            if (result === 'draw') current.draw += 1;
                        }
                    };

                    let r1: 'win'|'loss'|'draw' = 'draw';
                    let r2: 'win'|'loss'|'draw' = 'draw';

                    // Nur für die Statistik (Sieg/Niederlage), Punkte sind unabhängig davon
                    if (s1 > s2) {
                        r1 = 'win'; r2 = 'loss';
                    } else if (s2 > s1) {
                        r1 = 'loss'; r2 = 'win';
                    } else {
                        r1 = 'draw'; r2 = 'draw';
                    }

                    // Team 1 bekommt seine Punkte (s1)
                    updateStats(match.team1.spieler1.id, s1, r1);
                    updateStats(match.team1.spieler2.id, s1, r1);

                    // Team 2 bekommt seine Punkte (s2)
                    updateStats(match.team2.spieler1.id, s2, r2);
                    updateStats(match.team2.spieler2.id, s2, r2);
                }
            });
        });

        // 3. Sortieren nach totalen Punkten (Games)
        return Array.from(statsMap.values()).sort((a, b) => {
            // Wer mehr Games geholt hat, steht oben
            if (b.totalPoints !== a.totalPoints) {
                return b.totalPoints - a.totalPoints;
            }
            // Bei Gleichstand: Wer mehr Siege hat
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
                    {ranking.length === 0 ? (
                        <p style={{marginTop: '20px', color: '#aaa'}}>Noch keine Matches gespielt.</p>
                    ) : (
                        ranking.map((entry, index) => (
                            <div key={entry.playerId} className={`leaderboard-card rank-${index + 1}`}>
                                <div className="rank-badge">{index + 1}.</div>
                                <div className="player-info">
                                    <span className="player-name-large">{entry.name}</span>
                                    <span className="matches-info">
                                        Matches: {entry.matchesPlayed} | {entry.won} S - {entry.draw} U - {entry.lost} N
                                    </span>
                                </div>
                                <div className="total-points">
                                    {entry.totalPoints} <small>Pkt</small>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="button-bottom-container">
                <button className="back-btn" onClick={onBack}>Zurück zum Plan</button>
            </div>
        </div>
    );
}