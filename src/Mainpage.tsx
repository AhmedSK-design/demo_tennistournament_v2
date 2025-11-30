import { useState } from "react";

export default function Mainpage({openNext}: { openNext: () => void }) {


    return (
        <>

    <div className='header'>
      <h1>Tennis Tournament</h1>
    </div>
    <div className='button-middle-container'>
      <div className='button'>
      <button onClick={() =>{openNext();}}>Start a new Tournament</button>
      </div>
    </div>
    </>
    );
}