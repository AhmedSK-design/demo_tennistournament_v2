// HandlePlayer.tsx
import { useState } from "react";
import TournamentView from "./TournamentView"; // Import der View
import type { PlayerRequestDTO, TurnierRequest, TurnierResponse } from "./main/JS_Objects/types";
// Lokales Interface nur für die UI-Eingabe
interface LocalPlayer {
    id: number;
    name: string;
    gender: string;
    spielstärke: number;
}

export default function HandlePlayer({ openPrev }: { openPrev: () => void; dataFromLayout1?: any }) {
    // --- States ---
    const [name, setName] = useState("");
    const [spielstaerke, setSpielstaerke] = useState(5);
    const [selectedGender, setSelectedGender] = useState("M");
    
    const [players, setPlayers] = useState<LocalPlayer[]>([]);
    
    const [tennisCourts, setTennisCourts] = useState(1);
    const [rounds, setRounds] = useState(1);
    const [forceMixed, setForceMixed] = useState(false);

    const [loading, setLoading] = useState(false);
    const [tournamentPlan, setTournamentPlan] = useState<TurnierResponse | null>(null);

    // --- Logik ---

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
    }

    function handleRemovePlayer(id: number) {
        setPlayers(players.filter(p => p.id !== id));
    }

    async function handleStartTournament() {
        if (players.length < 4) {
            alert("Mindestens 4 Spieler notwendig!");
            return;
        }

        setLoading(true);

        // Mapping
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

    // --- Conditional Rendering ---
    
    // Wenn Plan vorhanden, zeige die separate View-Komponente
    if (tournamentPlan) {
        return (
            <TournamentView 
                plan={tournamentPlan} 
                allPlayers={players}  // <--- DAS IST NEU: Wir übergeben alle Spieler
                onBack={() => setTournamentPlan(null)} 
            />
        );
    }

    // Ansonsten: Setup Ansicht
    return (
        <>
            <div className='header'>
                <h1>Turnier Setup</h1>
            </div>

            <div className="windows-container">
                {/* Linke Spalte */}
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

                {/* Rechte Spalte */}
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