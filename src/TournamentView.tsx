import type {TurnierResponse, LocalPlayer, RundeModel} from "./main/JS_Objects/types";
import "./App.css";

interface TournamentViewProps {
    plan: TurnierResponse;
    allPlayers: LocalPlayer[]; // Wir brauchen alle Spieler, um zu wissen, wer fehlt
    onBack: () => void;
}

export default function TournamentView({ plan, allPlayers, onBack }: TournamentViewProps) {

    // Hilfsfunktion: Berechnet pausierende Spieler für eine Runde
    const getPausingPlayers = (runde: RundeModel) => {
        // 1. Sammle alle IDs der Spieler, die in Matches sind
        const playingIds = new Set<number>();
        runde.matches.forEach(m => {
            playingIds.add(m.team1.spieler1.id);
            playingIds.add(m.team1.spieler2.id);
            playingIds.add(m.team2.spieler1.id);
            playingIds.add(m.team2.spieler2.id);
        });

        // 2. Filtere die Gesamtliste nach denen, die NICHT im Set sind
        return allPlayers.filter(p => !playingIds.has(p.id));
    };

    return (
        <div className="tournament-container">
            <div className="header">
                <h1>Dein Turnierplan</h1>
            </div>

            <div className="rounds-scroll-container">
                {plan.runden.map((runde, index) => {
                    const pausingPlayers = getPausingPlayers(runde);

                    return (
                        <div key={runde.rundenNummer} className="round-wrapper">
                            
                            {/* Runden Header */}
                            <div className="round-header">
                                <h3>Runde {runde.rundenNummer}</h3>
                            </div>

                            {/* Grid für die Matches nebeneinander */}
                            <div className="matches-grid">
                                {runde.matches.map((match, idx) => (
                                    <div key={idx} className="match-card">
                                        <div className="team-box team-1">
                                            {match.team1.spieler1.name} & {match.team1.spieler2.name}
                                        </div>
                                        <div className="vs-badge">VS</div>
                                        <div className="team-box team-2">
                                            {match.team2.spieler1.name} & {match.team2.spieler2.name}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Anzeige der Pausierenden Spieler (nur wenn welche da sind) */}
                            {pausingPlayers.length > 0 && (
                                <div className="pause-section">
                                    <span className="pause-title">In der Pause</span>
                                    <div className="pausing-players-list">
                                        {pausingPlayers.map(p => (
                                            <span key={p.id} className="pause-badge">
                                                💤 {p.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Optischer Verbinder zur nächsten Runde (außer bei der letzten) */}
                            {index < plan.runden.length - 1 && (
                                <div className="round-connector"></div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <div className="button-bottom-container" style={{marginTop: '40px'}}>
                <button className="back-btn" onClick={onBack}>Zurück zur Eingabe</button>
            </div>
        </div>
    );
}