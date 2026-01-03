import { useState, useEffect } from "react";
import type { TurnierResponse, LocalPlayer, RundeModel } from "./main/JS_Objects/types"; 
import LeaderboardView from "./LeaderboardView"; 
import "./App.css";

interface TournamentViewProps {
    plan: TurnierResponse;
    allPlayers: LocalPlayer[];
    startTime?: string;
    matchDuration?: number;
    breakDuration?: number;
    onBack: () => void;
    onExport: () => void; // <--- NEU: Funktion zum Speichern
}

export default function TournamentView({ 
    plan, 
    allPlayers, 
    onBack, 
    onExport, // <--- NEU
    startTime = "09:00",
    matchDuration = 60,
    breakDuration = 10
}: TournamentViewProps) {

    const [localPlan, setLocalPlan] = useState<TurnierResponse>(plan);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    useEffect(() => {
        setLocalPlan(plan);
    }, [plan]);

    const updateScore = (roundIndex: number, matchIndex: number, team: 'team1' | 'team2', value: string) => {
        const newPlan = JSON.parse(JSON.stringify(localPlan));
        
        if (team === 'team1') {
            newPlan.runden[roundIndex].matches[matchIndex].scoreTeam1 = value;
        } else {
            newPlan.runden[roundIndex].matches[matchIndex].scoreTeam2 = value;
        }
        
        setLocalPlan(newPlan);
    };

    const checkAllScoresEntered = () => {
        for (const runde of localPlan.runden) {
            for (const match of runde.matches) {
                if (!match.scoreTeam1 || match.scoreTeam1 === "" || 
                    !match.scoreTeam2 || match.scoreTeam2 === "") {
                    return false;
                }
            }
        }
        return true;
    };

    const calculateRoundTime = (roundIndex: number) => {
        if (!startTime) return "";
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const startTotalMinutes = (startHour * 60) + startMinute;
        const offset = roundIndex * (matchDuration + breakDuration);
        const newTotalMinutes = startTotalMinutes + offset;
        const newHour = Math.floor(newTotalMinutes / 60) % 24;
        const newMinute = newTotalMinutes % 60;
        return `${String(newHour).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`;
    };

    const getPausingPlayers = (runde: RundeModel) => {
        const playingNames = new Set<string>();
        runde.matches.forEach(m => {
            playingNames.add(m.team1.spieler1.name);
            playingNames.add(m.team1.spieler2.name);
            playingNames.add(m.team2.spieler1.name);
            playingNames.add(m.team2.spieler2.name);
        });
        return allPlayers.filter(p => !playingNames.has(p.name));
    };

    if (showLeaderboard) {
        return (
            <LeaderboardView 
                plan={localPlan} 
                allPlayers={allPlayers} 
                onBack={() => setShowLeaderboard(false)} 
            />
        );
    }

    const allScoresReady = checkAllScoresEntered();

    return (
        <div className="tournament-container">
            <div className="header">
                <h1>Dein Turnierplan</h1>
            </div>

            <div className="rounds-scroll-container">
                {localPlan.runden.map((runde, rIndex) => {
                    const roundTime = calculateRoundTime(rIndex);
                    const pausingPlayers = getPausingPlayers(runde);

                    return (
                        <div key={runde.rundenNummer} className="round-wrapper">
                            <div className="round-header" style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '300px', gap: '20px'
                            }}>
                                <h3>Runde {runde.rundenNummer}</h3>
                                <span style={{ fontSize: '1rem', color: '#eee', backgroundColor: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '10px' }}>
                                    🕒 {roundTime} Uhr
                                </span>
                            </div>

                            <div className="matches-grid">
                                {runde.matches.map((match, mIndex) => (
                                    <div key={mIndex} className="match-card">
                                        <div className="match-row">
                                            <div className="team-box team-1">
                                                {match.team1.spieler1.name} & {match.team1.spieler2.name}
                                            </div>
                                            <input 
                                                type="number" 
                                                className="score-input"
                                                placeholder="0"
                                                value={match.scoreTeam1 || ''}
                                                onChange={(e) => updateScore(rIndex, mIndex, 'team1', e.target.value)}
                                            />
                                        </div>
                                        <div className="vs-badge">- VS -</div>
                                        <div className="match-row">
                                            <div className="team-box team-2">
                                                {match.team2.spieler1.name} & {match.team2.spieler2.name}
                                            </div>
                                            <input 
                                                type="number" 
                                                className="score-input"
                                                placeholder="0"
                                                value={match.scoreTeam2 || ''}
                                                onChange={(e) => updateScore(rIndex, mIndex, 'team2', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {pausingPlayers.length > 0 && (
                                <div className="pause-section">
                                    <span className="pause-title">In der Pause</span>
                                    <div className="pausing-players-list">
                                        {pausingPlayers.map(p => (
                                            <span key={p.id} className="pause-badge">💤 {p.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {rIndex < localPlan.runden.length - 1 && <div className="round-connector"></div>}
                        </div>
                    );
                })}
            </div>
            
            <div className="button-bottom-container" style={{marginTop: '0', gap: '15px'}}>
                <button className="back-btn" onClick={onBack}>Zurück zur Eingabe</button>
                
                {/* NEU: Export Button */}
                <button 
                    className="back-btn" 
                    onClick={onExport}
                    style={{
                        backgroundColor: '#2e7d32', // Excel Grün
                        border: '1px solid #1b5e20',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    💾 Plan Speichern
                </button>

                <button 
                    className="start-btn" 
                    onClick={() => setShowLeaderboard(true)}
                    disabled={!allScoresReady}
                    style={{ 
                        opacity: allScoresReady ? 1 : 0.5, 
                        cursor: allScoresReady ? 'pointer' : 'not-allowed',
                        background: allScoresReady ? 'linear-gradient(90deg, #ff8c00 0%, #ff0080 100%)' : '#444'
                    }}
                >
                    {allScoresReady ? "🏆 Zur Rangliste" : "Scores eingeben..."}
                </button>
            </div>
        </div>
    );
}