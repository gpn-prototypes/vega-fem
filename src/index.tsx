import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './app';

import '@gpn-prototypes/vega-modal/dist/src/Modal.css';

ReactDOM.render(<App />, document.getElementById('root'));

// <Root className="App" initialPortals={[{ name: 'modalRoot' }]} defaultTheme="dark">
// <Provider store={store}>
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// </Provider>
// </Root>,
