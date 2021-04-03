import React from 'react'
import Navigations from './App/Navigations'
import { Provider } from 'react-redux';
import { store, persistor } from './App/src/Redux/Store/index';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigations />
      </PersistGate>
    </Provider>
  )
}

export default App;

