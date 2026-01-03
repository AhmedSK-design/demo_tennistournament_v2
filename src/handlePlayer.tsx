import { useState } from "react";

// --- 1. Schnittstellen (Interfaces) passend zum Java Backend ---

// Das senden wir hin (Request)
interface PlayerRequestDTO {
    name: string;
    geschlecht: string;
    spielstaerke: number;
}

interface TurnierRequest {
    spielerListe: PlayerRequestDTO[];
    anzahlPlaetze: number;
    anzahlRunden: number;
    forceMixed: boolean;
}

// Das bekommen wir zurück (Response)
interface SpielerModel {
    id: number;
    name: string;
    geschlecht: string;
    spielstaerke: number;
}

interface TeamModel {
    spieler1: SpielerModel;
    spieler2: SpielerModel;
}

interface MatchModel {
    team1: TeamModel;
    team2: TeamModel;
}

interface RundeModel {
    rundenNummer: number;
    matches: MatchModel[];
}

interface TurnierResponse {
    runden: RundeModel[];
    // spielerListe ist auch drin, nutzen wir aber hier gerade nicht
}

// --- 2. Sub-Komponente für die Anzeige des Plans ---

function TournamentView({ plan, onBack }: { plan: TurnierResponse; onBack: () => void }) {
    return (
        <div className="tournament-container">
            <div className="header">
                <h1>Dein Turnierplan</h1>
                <button className="back-btn" onClick={onBack}>Zurück / Neu</button>
            </div>

            <div className="rounds-scroll-container">
                {plan.runden.map((runde) => (
                    <div key={runde.rundenNummer} className="round-card">
                        <h3>Runde {runde.rundenNummer}</h3>
                        <div className="matches-list">
                            {runde.matches.map((match, idx) => (
                                <div key={idx} className="match-item" style={{ 
                                    border: '1px solid #444', 
                                    margin: '5px 0', 
                                    padding: '10px',
                                    borderRadius: '8px',
                                    backgroundColor: '#2a2a2a'
                                }}>
                                    {/* Team 1 */}
                                    <div style={{ color: '#4caf50', fontWeight: 'bold' }}>
                                        {match.team1.spieler1.name} & {match.team1.spieler2.name}
                                    </div>
                                    <div style={{ fontSize: '0.8em', color: '#888' }}>VS</div>
                                    {/* Team 2 */}
                                    <div style={{ color: '#2196f3', fontWeight: 'bold' }}>
                                        {match.team2.spieler1.name} & {match.team2.spieler2.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- 3. Haupt-Komponente ---

// Lokales Interface für die Eingabe-Maske
interface LocalPlayer {
    id: number;
    name: string;
    gender: string;
    spielstärke: number; // Hier nutzen wir "ä" für die UI, mappen es aber später
}

export default function HandlePlayer({ openPrev }: { openPrev: () => void; dataFromLayout1?: any }) {
    // Eingabe States
    const [name, setName] = useState("");
    const [spielstaerke, setSpielstaerke] = useState(5);
    const [selectedGender, setSelectedGender] = useState("M");
    
    // Listen States
    const [players, setPlayers] = useState<LocalPlayer[]>([]);
    
    // Parameter States
    const [tennisCourts, setTennisCourts] = useState(1);
    const [rounds, setRounds] = useState(1);
    const [forceMixed, setForceMixed] = useState(false);

    // System States
    const [loading, setLoading] = useState(false);
    const [tournamentPlan, setTournamentPlan] = useState<TurnierResponse | null>(null);

    // Spieler hinzufügen
    function handleAddPlayer() {
        if (name.trim() === "") return;
        
        const newPlayer: LocalPlayer = {
            id: Date.now(), // Unique ID durch Timestamp
            name: name,
            gender: selectedGender,
            spielstärke: spielstaerke
        };
        
        setPlayers([...players, newPlayer]);
        setName(""); // Reset Name Input
    }

    // Spieler entfernen
    function handleRemovePlayer(id: number) {
        setPlayers(players.filter(p => p.id !== id));
    }

    // Start-Logik (Kommunikation mit Backend)
    async function handleStartTournament() {
        if (players.length < 4) {
            alert("Mindestens 4 Spieler notwendig!");
            return;
        }

        setLoading(true);

        // Mapping: Frontend-Objekt -> Backend-DTO
        const spielerListeDTO: PlayerRequestDTO[] = players.map(p => ({
            name: p.name,
            geschlecht: p.gender,
            spielstaerke: p.spielstärke // Wichtig: ä -> ae Mapping
        }));

        const payload: TurnierRequest = {
            spielerListe: spielerListeDTO,
            anzahlPlaetze: tennisCourts,
            anzahlRunden: rounds,
            forceMixed: forceMixed
        };

        try {
            const response = await fetch("http://localhost:8080/api/turnier/berechnen", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Fehler bei der Berechnung");
            }

            const data: TurnierResponse = await response.json();
            setTournamentPlan(data); // Ergebnis speichern -> Zeigt TournamentView an

        } catch (err: any) {
            console.error(err);
            alert("Fehler: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    // Wenn Plan vorhanden, zeige Plan an
    if (tournamentPlan) {
        return <TournamentView plan={tournamentPlan} onBack={() => setTournamentPlan(null)} />;
    }

    // Ansonsten: Setup Ansicht
    return (
        <>
            <div className='header'>
                <h1>Turnier Setup</h1>
            </div>

            <div className="windows-container">
                {/* Linke Spalte: Spieler */}
                <div className="left-column">
                    <div className="small-window">
                        <h3>Neuer Spieler</h3>
                        <div className="mini-window" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input 
                                type="text" 
                                placeholder="Name" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                maxLength={15}
                            />
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <select 
                                    value={selectedGender} 
                                    onChange={e => setSelectedGender(e.target.value)}
                                    style={{ flex: 1 }}
                                >
                                    <option value="M">Mann</option>
                                    <option value="F">Frau</option>
                                </select>
                                <input 
                                    type="number" 
                                    min="1" max="10" 
                                    value={spielstaerke} 
                                    onChange={e => setSpielstaerke(Number(e.target.value))}
                                    style={{ width: '60px' }}
                                    title="Spielstärke (1-10)"
                                />
                            </div>
                            <button onClick={handleAddPlayer}>Hinzufügen +</button>
                        </div>
                    </div>

                    <div className="small-below-window">
                        <h3>Teilnehmer ({players.length})</h3>
                        <div className="player-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {players.map(p => (
                                <div key={p.id} className="player-box" style={{ 
                                    display: 'flex', justifyContent: 'space-between', 
                                    padding: '5px', borderBottom: '1px solid #333' 
                                }}>
                                    <span>{p.name} ({p.gender}) <small>Lvl:{p.spielstärke}</small></span>
                                    <button 
                                        onClick={() => handleRemovePlayer(p.id)}
                                        style={{ background: 'red', padding: '2px 8px', fontSize: '0.8rem' }}
                                    >X</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rechte Spalte: Einstellungen */}
                <div className="big-right-window">
                    <h3>Parameter</h3>
                    <div className="mini-window-right" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label>Anzahl Plätze: </label>
                            <input 
                                type="number" min="1" 
                                value={tennisCourts} 
                                onChange={e => setTennisCourts(Number(e.target.value))} 
                            />
                        </div>
                        <div>
                            <label>Anzahl Runden: </label>
                            <input 
                                type="number" min="1" 
                                value={rounds} 
                                onChange={e => setRounds(Number(e.target.value))} 
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input 
                                type="checkbox" 
                                id="mixedCheck" 
                                checked={forceMixed} 
                                onChange={e => setForceMixed(e.target.checked)} 
                            />
                            <label htmlFor="mixedCheck">Mixed erzwingen (M/F)</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="button-bottom-container">
                <button className="back-btn" onClick={openPrev}>Abbrechen</button>
                <button 
                    className="start-btn" 
                    onClick={handleStartTournament} 
                    disabled={loading}
                    style={{ backgroundColor: loading ? '#555' : '' }}
                >
                    {loading ? "Berechne..." : "Turnier Starten"}
                </button>
            </div>
        </>
    );
}