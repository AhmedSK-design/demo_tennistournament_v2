import { useState } from "react";
import TournamentView from "./TournamentView"; 
import type { PlayerRequestDTO, TurnierRequest, TurnierResponse, LocalPlayer } from "./main/JS_Objects/types"; // Pfad ggf. anpassen

export default function HandlePlayer({ openPrev }: { openPrev: () => void; dataFromLayout1?: any }) {
    // --- States für Spieler ---
    const [name, setName] = useState("");
    const [spielstaerke, setSpielstaerke] = useState(5);
    const [selectedGender, setSelectedGender] = useState("M");
    const [players, setPlayers] = useState<LocalPlayer[]>([]);
    
    // --- States für Parameter ---
    const [tennisCourts, setTennisCourts] = useState(1);
    const [rounds, setRounds] = useState(1);
    const [forceMixed, setForceMixed] = useState(false);
    
    // --- States für Zeit-Management ---
    const [startTime, setStartTime] = useState("09:00"); 
    const [matchDuration, setMatchDuration] = useState(60); // Standard: 60 Min
    const [breakDuration, setBreakDuration] = useState(15); // Standard: 15 Min

    // --- System States ---
    const [loading, setLoading] = useState(false);
    const [tournamentPlan, setTournamentPlan] = useState<TurnierResponse | null>(null);

    // --- Logik: Spieler hinzufügen ---
    function handleAddPlayer() {
        if (name.trim() === "") return;
        
        const newPlayer: LocalPlayer = {
            id: Date.now(),
            name: name,
            gender: selectedGender,
            spielstärke: spielstaerke
        };
        
        setPlayers([...players, newPlayer]);
        setName(""); 
        // Fokus könnte hier zurück aufs Input gesetzt werden
    }

    // --- Logik: Spieler entfernen ---
    function handleRemovePlayer(id: number) {
        setPlayers(players.filter(p => p.id !== id));
    }

    // --- Logik: Turnier starten ---
    async function handleStartTournament() {
        if (players.length < 4) {
            alert("Mindestens 4 Spieler notwendig!");
            return;
        }

        setLoading(true);

        const spielerListeDTO: PlayerRequestDTO[] = players.map(p => ({
            name: p.name,
            geschlecht: p.gender,
            spielstaerke: p.spielstärke
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
            setTournamentPlan(data); 

        } catch (err: any) {
            console.error(err);
            alert("Fehler: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    // --- View Rendering ---
    
    if (tournamentPlan) {
        return (
            <TournamentView 
                plan={tournamentPlan} 
                allPlayers={players}
                // Wir übergeben die Zeit-Einstellungen an die View:
                // @ts-ignore (Falls Props in TournamentView noch nicht definiert sind)
                startTime={startTime}
                // @ts-ignore
                matchDuration={matchDuration}
                // @ts-ignore
                breakDuration={breakDuration}
                onBack={() => setTournamentPlan(null)} 
            />
        );
    }

    // --- Setup Rendering ---
    return (
        <>
            <div className='header'>
                <h1>Turnier Setup</h1>
            </div>

            <div className="windows-container">
                {/* Linke Spalte: Spieler Eingabe */}
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
                                        className="delete-btn"
                                    >
                                    X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rechte Spalte: Parameter & Zeit */}
                <div className="big-right-window">
                    <h3>Parameter</h3>
                    <div className="mini-window-right" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        {/* Basis Parameter */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label>Plätze: </label>
                                <input 
                                    type="number" min="1" 
                                    value={tennisCourts} 
                                    onChange={e => setTennisCourts(Number(e.target.value))} 
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Runden: </label>
                                <input 
                                    type="number" min="1" 
                                    value={rounds} 
                                    onChange={e => setRounds(Number(e.target.value))} 
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        {/* Zeit Einstellungen */}
                        <div style={{ borderTop: '1px solid #444', paddingTop: '10px', marginTop: '5px' }}>
                            <label style={{ color: '#aaa', fontSize: '0.9rem' }}>Zeitplan</label>
                            
                            <div style={{ marginTop: '5px' }}>
                                <label>Startzeit:</label>
                                <input 
                                    type="time" 
                                    value={startTime} 
                                    onChange={e => setStartTime(e.target.value)}
                                    style={{ marginLeft: '10px' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.85rem' }}>Dauer (Min):</label>
                                    <input 
                                        type="number" min="1" 
                                        value={matchDuration} 
                                        onChange={e => setMatchDuration(Number(e.target.value))} 
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.85rem' }}>Pause (Min):</label>
                                    <input 
                                        type="number" min="0" 
                                        value={breakDuration} 
                                        onChange={e => setBreakDuration(Number(e.target.value))} 
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Checkbox */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                            <input 
                                type="checkbox" 
                                id="mixedCheck" 
                                checked={forceMixed} 
                                onChange={e => setForceMixed(e.target.checked)} 
                            />
                            <label htmlFor="mixedCheck">Mixed erzwingen</label>
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