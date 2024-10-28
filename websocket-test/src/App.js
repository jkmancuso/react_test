import logo from './logo.svg';
import './App.css';
import { useState,useEffect } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket"



function App() {
  const [text, setText] = useState('');
  const [finaltext, setfinalText] = useState('');


  return (
    <div className="App">
      Msg <input value={text} onChange={e => setText(e.target.value)}/>
      <button onClick={() => setfinalText(text)}>Submit</button>
    <MyTestComponent 
      msg={finaltext}
      />
    </div>
  );
}

function MyTestComponent({ msg }) {

  const WS_URL = "wss://echo.websocket.org"
 
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )

  
  useEffect(() => {
    
    if(readyState!=ReadyState.OPEN) {
      return
    }

    console.log(`${readyState} : ${msg}`)
    sendJsonMessage({"ping":"pong"})
  }, [msg])

  useEffect(() => {

    if(readyState!=ReadyState.OPEN) {
      return
    }
    
    const myJSON = JSON.stringify(lastJsonMessage);
    console.log(`Got a new message: ${myJSON}`)
    },[lastJsonMessage])

 
}

export default App;
