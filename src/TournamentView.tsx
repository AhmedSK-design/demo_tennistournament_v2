import type { TurnierResponse, LocalPlayer, RundeModel } from "./main/JS_Objects/types";
import "./App.css";

// In TournamentView.tsx
interface TournamentViewProps {
    plan: TurnierResponse;
    allPlayers: LocalPlayer[];
    startTime?: string;      // Startzeit (z.B. "09:00")
    matchDuration?: number;  // Dauer eines Spiels in Minuten
    breakDuration?: number;  // Dauer der Pause in Minuten
    onBack: () => void;
}

export default function TournamentView({ 
    plan, 
    allPlayers, 
    onBack, 
    startTime = "09:00", // Fallback, falls leer
    matchDuration = 60,  // Fallback
    breakDuration = 10   // Fallback
}: TournamentViewProps) {

    // Hilfsfunktion: Berechnet pausierende Spieler für eine Runde
    const getPausingPlayers = (runde: RundeModel) => {
        const playingIds = new Set<number>();
        runde.matches.forEach(m => {
            playingIds.add(m.team1.spieler1.id);
            playingIds.add(m.team1.spieler2.id);
            playingIds.add(m.team2.spieler1.id);
            playingIds.add(m.team2.spieler2.id);
        });
        return allPlayers.filter(p => !playingIds.has(p.id));
    };

    // NEU: Hilfsfunktion zur Berechnung der Startzeit pro Runde
    const calculateRoundTime = (roundIndex: number) => {
        if (!startTime) return "";

        // 1. Startzeit ("09:00") in Stunden und Minuten zerlegen
        const [startHour, startMinute] = startTime.split(":").map(Number);
        
        // 2. Startzeit in Minuten seit Mitternacht umrechnen
        const startTotalMinutes = (startHour * 60) + startMinute;

        // 3. Offset berechnen: (RundenIndex) * (Spielzeit + Pause)
        // Runde 1 (Index 0): 0 Min dazu
        // Runde 2 (Index 1): 1x (Spiel + Pause) dazu, usw.
        const offset = roundIndex * (matchDuration + breakDuration);

        // 4. Neue Gesamtminuten berechnen
        const newTotalMinutes = startTotalMinutes + offset;

        // 5. Zurückrechnen in HH:MM
        const newHour = Math.floor(newTotalMinutes / 60) % 24; // % 24 damit es nach 23 Uhr bei 0 weitergeht
        const newMinute = newTotalMinutes % 60;

        // 6. Formatieren mit führender Null (z.B. 9 -> "09")
        const formattedHour = String(newHour).padStart(2, "0");
        const formattedMinute = String(newMinute).padStart(2, "0");

        return `${formattedHour}:${formattedMinute}`;
    };

    return (
        <div className="tournament-container">
            <div className="header">
                <h1>Dein Turnierplan</h1>
            </div>

            <div className="rounds-scroll-container">
                {plan.runden.map((runde, index) => {
                    const pausingPlayers = getPausingPlayers(runde);
                    // Hier berechnen wir die Zeit für die aktuelle Runde
                    const roundTime = calculateRoundTime(index);

                    return (
                        <div key={runde.rundenNummer} className="round-wrapper">
                            
                            {/* Runden Header mit Zeit */}
                            <div className="round-header" style={{
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                minWidth: '300px', // Damit Zeit und Titel nicht zu eng kleben
                                gap: '20px'
                            }}>
                                <h3>Runde {runde.rundenNummer}</h3>
                                <span style={{ 
                                    fontSize: '1rem', 
                                    color: '#eee', 
                                    backgroundColor: 'rgba(0,0,0,0.3)', 
                                    padding: '4px 10px', 
                                    borderRadius: '10px',
                                    fontWeight: 'normal'
                                }}>
                                    🕒 {roundTime} Uhr
                                </span>
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

                            {/* Anzeige der Pausierenden Spieler */}
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

                            {/* Optischer Verbinder */}
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