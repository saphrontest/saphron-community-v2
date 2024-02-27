import Router from './Router';
import './App.css';
import { Capacitor } from '@capacitor/core';
import { Box } from '@chakra-ui/react';

function App() {
  return (
    <>
      {Capacitor.getPlatform() === 'ios' && <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />  }
      <div className={`App ${Capacitor.getPlatform() === 'ios' ? 'ios' : ''}`}>
        <Box bg="gray.100">
          <Router />
        </Box>
      </div>
    </>
  );
}

export default App;
