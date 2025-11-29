import App from "./App";

function handleAddPlayers() {
  return(
    
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
  )
}

export default handleAddPlayers;