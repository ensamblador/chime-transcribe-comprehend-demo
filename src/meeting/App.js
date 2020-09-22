import React, {useState, useEffect} from 'react';
import './App.css';
import Meeting from './components/Meeting';
//import MicRecorder from './components/RecorderClass'
import {CHIME_BACKEND}  from '../chime-api-url.js'

// your own  chime backend api gateway here , see output of 'sam deploy' in step 0
//const CHIME_BACKEND = 'https://0qyyzzc6jd.execute-api.us-east-1.amazonaws.com/Prod/'

const endpoint = {
  join: CHIME_BACKEND + 'join',
  end: CHIME_BACKEND + 'end',
  logs: CHIME_BACKEND + 'logs'
}

//const recorder = new MicRecorder()


function App({ client }) {
  
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {

    const load = async () => {
     // await recorder.init()
      setLoaded(true)
    }
    if (loaded === false) {
      load()
    }
  }, [loaded])
  return (
    <div className="App">
      <Meeting client={client} endpoint={endpoint} />
    </div>
  );
}

export default App;
