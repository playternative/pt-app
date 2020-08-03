import React from 'react';

import './App.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";

import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { Container } from 'reactstrap'

import configureStore, { history } from './Store'

import Application from '@/containers/Application'

const { store, persistor } = configureStore()

const App = () => {
  return (
    <Container className="mw-100 p-0 m-0">
      <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
         <ConnectedRouter history={history}>
            <Application />
         </ConnectedRouter>
       </PersistGate>
     </Provider>
    </Container>
  )
}

export default App;
