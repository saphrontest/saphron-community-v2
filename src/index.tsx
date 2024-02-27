import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from "./chakra/theme";
import {Provider} from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import {Capacitor} from '@capacitor/core'
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <ChakraProvider
        theme={theme}
        toastOptions={{
            defaultOptions: {
              position: Capacitor.getPlatform() === 'ios' ? 'top' : 'top-right',
              containerStyle: {
                width: "calc(100% - 32px)"
              }
            }
          }}
        >
          <App />
        </ChakraProvider>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);