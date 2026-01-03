import { useState } from "react";
import type { Spieler } from "./main/JS_Objects/Spieler.js";

function TournamentView({ plan, onBack }: { plan: any; onBack: () => void }) {
    return (
        <div className="tournament-results-container">
            <div className="header">
                <h1>Turnierplan</h1>
                <button className="back-btn" onClick={onBack}>Zurück zur Bearbeitung</button>
            </div>

            <div className="rounds-grid">
                {plan.runden.map((runde: any) => (
                    <div key={runde.rundenNummer} className="round-card">
                        <h2 className="round-title">Runde {runde.rundenNummer}</h2>
                        <div className="matches-list">
                            {runde.matches.map((match: any, idx: number) => (
                                <div key={idx} className="match-item">
                                    <div className="team-display">
                                        <span className="player-name">{match.team1.spieler1.name}</span>
                                        <span className="and-sign">&</span>
                                        <span className="player-name">{match.team1.spieler2.name}</span>
                                    </div>
                                    <div className="vs-badge">VS</div>
                                    <div className="team-display">
                                        <span className="player-name">{match.team2.spieler1.name}</span>
                                        <span className="and-sign">&</span>
                                        <span className="player-name">{match.team2.spieler2.name}</span>
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

export default function HandlePlayer({ openPrev }: { openPrev: () => void; dataFromLayout1?: any }) {
    const [selectedGender, setSelectedGender] = useState("M");
    const [name, setName] = useState("");
    const [spielstaerke, setSpielstaerke] = useState(5);
    const [players, setPlayers] = useState<Spieler[]>([]);
    const [tennisCourts, setTennisCourts] = useState(1);
    const [rounds, setRounds] = useState(1);
    const [loading, setLoading] = useState(false);
    const [tournamentPlan, setTournamentPlan] = useState<any>(null);

    function handleAddPlayer() {
        if (name.trim() === "") {
            alert("Bitte geben Sie einen Namen ein.");
            return;
        }
        const newPlayer: any = {
            id: players.length + 1,
            name: name,
            gender: selectedGender,
            spielstärke: spielstaerke
        };
        setPlayers([...players, newPlayer]);
        setName("");
    }

    function handleRemovePlayer(id: number) {
        setPlayers(players.filter(player => player.id !== id));
    }

    async function handleStartTournament() {
        if (players.length < 4) {
            alert("Mindestens 4 Spieler erforderlich!");
            return;
        }
        setLoading(true);

        // Vorbereitung der Daten für das Backend (DTO Mapping)
        const requestData = {
            spielerListe: players.map(p => ({
                name: p.name,
                geschlecht: p.gender, // Mapping auf Java: geschlecht
                spielstaerke: (p as any).spielstärke // Mapping auf Java: spielstaerke
            })),
            anzahlPlaetze: tennisCourts,
            anzahlRunden: rounds,
            forceMixed: false
        };

        try {
            const response = await fetch("http://localhost:8080/api/turnier/berechnen", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Server-Fehler bei der Berechnung");
            }

            const result = await response.json();
            setTournamentPlan(result); // Das Turnier-Objekt aus dem Backend speichern
        } catch (error: any) {
            alert("Fehler: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    if (tournamentPlan) {
        return <TournamentView plan={tournamentPlan} onBack={() => setTournamentPlan(null)} />;
    }

    return (
        <>
            <div className='header'>
                <h1>Turnier Setup</h1>
            </div>

            <div className="windows-container">
                <div className="left-column">
                    <div className="small-window">
                        <h3>Spieler hinzufügen</h3>
                        <div className="mini-window">
                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={12} />
                            <input type="number" placeholder="Stärke (1-10)" min={1} max={10} value={spielstaerke} onChange={(e) => setSpielstaerke(Number(e.target.value))} />
                            <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                                <option value="M">Männlich</option>
                                <option value="W">Weiblich</option>
                            </select>
                            <button onClick={handleAddPlayer}>+ Spieler Hinzufügen</button>
                        </div>
                    </div>

                    <div className="small-below-window">
                        <h3>Teilnehmer ({players.length})</h3>
                        <div className="player-list">
                            {players.map((player) => (
                                <div key={player.id} className="player-box">
                                    <span>{player.name} ({player.gender}) - Stärke: {(player as any).spielstärke}</span>
                                    <button onClick={() => handleRemovePlayer(player.id)}>X</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="big-right-window">
                    <h3>Turnier-Parameter</h3>
                    <div className="mini-window-right">
                        <label>Plätze:</label>
                        <input type="number" value={tennisCourts} min={1} onChange={(e) => setTennisCourts(Number(e.target.value))} />
                        <label>Runden:</label>
                        <input type="number" value={rounds} min={1} onChange={(e) => setRounds(Number(e.target.value))} />
                    </div>
                </div>
            </div>

            <div className="button-bottom-container">
                <button className="back-btn" onClick={openPrev}>Abbrechen</button>
                <button className="start-btn" onClick={handleStartTournament} disabled={loading}>
                    {loading ? "Berechnet Plan..." : "Turnier Starten"}
                </button>
            </div>
        </>
    );
}