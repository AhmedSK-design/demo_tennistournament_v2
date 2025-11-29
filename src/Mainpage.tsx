import { useState } from "react";

function Mainpage() {
    const [numPlayers, setNumPlayers] = useState(0)
    const [players, setPlayers] = useState<{ id: number; name: string }[]>([])
    

    const handleAddPlayers = () => {
    if (numPlayers > 3){
    const newPlayers = Array.from({ length: numPlayers }, (_, i) => ({
      id: i,
      name: "",
    }));
    setPlayers(newPlayers);
  }
  }

    return (
        <>
    <div className='header'>
      <h1>Tennis Tournament</h1>
    </div>

        <div className="card">
        <h2>Create a new Tournament</h2>
        <input type="text" placeholder="How many players" onChange={(e) => 
          setNumPlayers(parseInt(e.target.value) || 0)} />          
      <div className='button'>
        <button onClick={handleAddPlayers}>Add Player</button>
      </div>
      </div>
    </>
    );
}