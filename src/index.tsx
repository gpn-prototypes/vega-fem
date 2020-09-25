import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Root } from '@gpn-prototypes/vega-root';

import store from './store/store';
import { App } from './App';

import './App.css';
import '@gpn-prototypes/vega-modal/dist/src/Modal.css';

ReactDOM.render(
  <Root className="App" initialPortals={[{ name: 'modalRoot' }]} defaultTheme="dark">
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </Root>,
  document.getElementById('root'),
);
