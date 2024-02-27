import './App.css';
import Router from './Router';
import { Capacitor } from '@capacitor/core';

const IosMeta = () => {
  return (
    <>
      {
        Capacitor.getPlatform() === 'ios' ?
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
          : null
      }
    </>
  )
}

function App() {
  return (
    <>
      <IosMeta />
      <div className={`App ${Capacitor.getPlatform() === 'ios' ? 'ios' : ''}`}>
        <Router />
      </div>
    </>
  );
}

export default App;
