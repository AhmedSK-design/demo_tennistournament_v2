import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [numPlayers, setNumPlayers] = useState(0)
  const [players, setPlayers] = useState<{ id: number; name: string }[]>([])
  const [showSetup, setShowSetup] = useState(true);
  const [showback, setShowback] = useState(false);


  const backbutton = () => {
    setShowback(false);
    setShowSetup(true);
  };

  const handleAddPlayers = () => {
    if (numPlayers > 3){
    const newPlayers = Array.from({ length: numPlayers }, (_, i) => ({
      id: i,
      name: "",
    }));
    setPlayers(newPlayers);
    setShowSetup(false);
    setShowback(true);
  }
  }

  return (
    <>
    <div className='header'>
      <h1>Tennis Tournament</h1>
    </div>


      {showSetup &&(
        <div className="card">
        <h2>Create a new Tournament</h2>
        <input type="text" placeholder="How many players" onChange={(e) => 
          setNumPlayers(parseInt(e.target.value) || 0)} />          
      <div className='button'>
        <button onClick={handleAddPlayers}>Add Player</button>
      </div>
      </div>
      )}

      {showback && (
        <div className='Players'>
          <h3>Player information</h3>
        {players.map((player, i) => (
          <input
            key={player.id}
            type="text"
            placeholder={`Enter player ${i + 1} name`}
          />

        ))}
        <button onClick={backbutton}>Back</button>
      </div>
      )}

    

    
      
    </>
  )
}

export default App
