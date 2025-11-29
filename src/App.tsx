import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Mainpage from './Mainpage'
import HandlePlayer from './handlePlayer'

function App() {
  const [numPlayers, setNumPlayers] = useState(0)
  const [players, setPlayers] = useState<{ id: number; name: string }[]>([])
  const [showSetup, setShowSetup] = useState(true);
  const [showback, setShowback] = useState(false);
  const [page, setPage] = useState<"Mainpage" | "handlePlayer">("Mainpage");
  const [sharedData, setSharedData] = useState<any>(null);

  const switchToLayout2 = () => setPage("handlePlayer");
  const switchToLayout1 = () => setPage("Mainpage");

  const resetAll = () => {
  setPage("Mainpage");
  setSharedData(null);
  setNumPlayers(0);
  setPlayers([]);
};


  return (
    <>
    {page === "Mainpage" && (
        <Mainpage openNext={() => setPage("handlePlayer")}
        sendToApp={(val) => setSharedData(val)} />
      )}
      {page === "handlePlayer" && (
        <HandlePlayer
          openPrev={() => resetAll()}
          dataFromLayout1={sharedData}
        />
      )}
      
    </>
  )
}

export default App
