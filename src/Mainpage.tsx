import { useState } from "react";

export default function Mainpage({openNext,sendToApp}: { openNext: () => void ; sendToApp: (val: { id: number; name: string }[]) => void }) {
    const [numPlayers, setNumPlayers] = useState(0)
    const [players, setPlayers] = useState<{ id: number; name: string }[]>([])
    

    const handleAddPlayers = () => {
    if (numPlayers > 3){
    const newPlayers = Array.from({ length: numPlayers }, (_, i) => ({
      id: i,
      name: "",
    }));
    setPlayers(newPlayers);
    sendToApp(newPlayers);
  }
  }

    return (
        <>
    <div className='header'>
      <h1>Tennis Tournament</h1>
    </div>
    <div className="card">
      <div className='button'>
        <button onClick={() =>{openNext();}}>Start</button>
      </div>
    </div>
    </>
    );
}