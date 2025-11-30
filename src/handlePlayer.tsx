import { useState } from "react";
import type { Spieler } from "./main/JS_Objects/Spieler.js";

export default function HandlePlayer({openPrev,dataFromLayout1}: {openPrev: () => void;dataFromLayout1: { id: number; name: string }[];}) {
  const [selectedGender, setSelectedGender] = useState("");
  const [name, setName] = useState("");
  const [Spielstärke, setSpielstärke] = useState(0);
  const [players, setPlayers] =useState<Spieler[]>([]);
  const [tennisCourts, setTennisCourts] = useState(1);
  const [rounds, setRounds] = useState(1);
  const [gameLength, setGameLength] = useState(1);
  const [breakLength, setBreakLength] = useState(1);

  function handleAddPlayer() {
    // Funktion zum Hinzufügen eines Spielers
    if (name.trim() === "") {
      alert("Bitte geben Sie einen Namen ein.");
      return;
    }
    if (Spielstärke < 1 || Spielstärke > 10) {
      alert("Bitte geben Sie eine gültige Spielstärke zwischen 1 und 10 ein.");
      return;
    }
    // Überprüfen, ob Geschlecht ausgewählt ist (wichtig, da disabled)
    if (selectedGender === "") {
        alert("Bitte wählen Sie das Geschlecht aus.");
        return;
    }
    const newPlayer: Spieler = {
      id: players.length + 1,
      name: name,
      gender: selectedGender,
      spielstärke: Spielstärke
    };
    setPlayers([...players, newPlayer]);
    // Eingabefelder zurücksetzen
    setName("");
    // Behalten Sie die letzte Auswahl oder setzen Sie auf Standard
    // setSelectedGender(""); // Nicht zurücksetzen, um Nutzereingabe zu beschleunigen
  }

  function handleRemovePlayer(id: number) {
    // Funktion zum Entfernen eines Spielers
    setPlayers(players.filter(player => player.id !== id));
  }

  // Setze den initialen Geschlechts-Status auf 'M', damit die Auswahl nicht "disabled" bleibt
  useState(() => {setSelectedGender("M");});
  
  return (
    <>
      <div className='header'>
        <h1>Handle Player Page</h1>
      </div>

      {/* Hier beginnt der responsive Grid-Container, der den verfügbaren Platz nutzt */}
      <div className="windows-container">
        
        {/* Linke Spalte: Enthält die zwei kleinen Fenster übereinander */}
        <div className="left-column">
          <div className="small-window">
             <h3>Spielerdaten eingeben</h3>
              <div className="mini-window">
                <input type="text" placeholder="Player Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={12} />
                <input type="number" placeholder="Spielstärke 1 - 10" min={1} max={10} onChange={(e) => setSpielstärke(Number(e.target.value))} />
                <label>
                  <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                    <option value="" disabled>Geschlecht</option>
                    <option value="M">M</option>
                    <option value="W">W</option>
                  </select>
                </label>
                <button onClick={handleAddPlayer}>+ Hinzufügen</button>
              </div>
          </div>

          <div className="small-below-window">
             <h3>Spieler Liste ({players.length})</h3>
            <div className="player-list">
              {players.map((player) => (
                <div key={player.id} className="player-box">
                  <span>Name: {player.name}</span>
                  <span> Stärke: {player.spielstärke}</span>
                  <span> Geschlecht: {player.gender} </span>
                <div className="player-delete">
                  <button onClick={() => handleRemovePlayer(player.id)}>Entfernen</button>
                </div>
              </div>
           ))}
          </div>
          </div>
        </div>
        
        {/* Rechte Spalte: Das große Fenster */}
        <div className="big-right-window">
          <h3>Turnierparameter</h3>
          <div className="mini-window-right">
          <input type="number" placeholder="Anzahl Tennisplätze" min={1} onChange={(e) => setTennisCourts(Number(e.target.value))} />
          <input type="number" placeholder="Anzahl Runden" min={1} onChange={(e) => setRounds(Number(e.target.value))} />
          <input type="number" placeholder="Spiellänge" min={1} onChange={(e) => setGameLength(Number(e.target.value))} />
          <input type="number" placeholder="Pausenlänge" min={1} onChange={(e) => setBreakLength(Number(e.target.value))} />
          </div>
        </div>
      </div>


      <div className="button-bottom-container">
        <div className="back-button">
          <button onClick={openPrev}>Back</button>
        </div>
        <div className="back-button">
        <button onClick={openPrev}>Start</button>
        </div>
      </div>
    </>
  );
}