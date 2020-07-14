import React from 'react';
import { presetGpnDark, Theme } from '@gpn-prototypes/vega-ui';

import { Header } from './components/header/Header';
import { Main}  from './components/Main/Main';
import { Navigation } from './components/navigation/Navigation';

import './App.css';

export const App = (): React.ReactElement => {
  return (
    <Theme className="App" preset={presetGpnDark}>
	    <Header />
      <Navigation />
      <Main />
    </Theme>
  );
};
