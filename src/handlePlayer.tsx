import App from "./App";

export default function HandlePlayer({openPrev,dataFromLayout1}: {openPrev: () => void; dataFromLayout1: { id: number; name: string }[];}) {



  return(
    
        <div className='Players'>
        <div> 
        <h1>Enter Player information</h1>
        </div>
        {dataFromLayout1.map((player, i) => (
          <input
            key={player.id}
            type="text"
            placeholder={`Enter player ${i + 1} name`}
          />

        ))}
        <div className='button'>
        <button onClick={openPrev}>Back</button>
        </div>
      </div>
      
  )
}
