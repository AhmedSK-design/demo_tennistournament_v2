import { useState } from "react";
import App from "./App";

export default function HandlePlayer({openPrev,dataFromLayout1}: {openPrev: () => void;dataFromLayout1: { id: number; name: string }[];}) {
  const [selectedGender, setSelectedGender] = useState("");
  const [name, setName] = useState("");
  const [Spielstärke, setSpielstärke] = useState(5);
  const [players, setPlayers] = useState<{ id: number; name: string; gender: string; spielstärke: number }[]>([])

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
    const newPlayer = {
      id: players.length,
      name: name,
      gender: selectedGender,
      spielstärke: Spielstärke
    };
    setPlayers([...players, newPlayer]);
    // Eingabefelder zurücksetzen
    setName("");
    setSpielstärke(5);
    setSelectedGender("M");
    
  }

  function handleRemovePlayer(id: number) {
    // Funktion zum Entfernen eines Spielers
    setPlayers(players.filter(player => player.id !== id));
  }

  



  return (
    <>
      <div className='header'>
        <h1>Handle Player Page</h1>
      </div>

      <div className="small-window">
        <h3>Enter Player information</h3>
        <div className="mini-window">
        <input type="text" placeholder="Player Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={12} />
        <input type="number" placeholder="Spielstärke 1 - 10" min={1} max={10} value={Spielstärke} onChange={(e) => setSpielstärke(Number(e.target.value))} />
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
      <h3>Spieler Liste</h3>
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



      <div className="button-bottom-container">
        <div className="back-button">
          <button onClick={openPrev}>Back</button>
        </div>
      </div>
    </>
  );
}
