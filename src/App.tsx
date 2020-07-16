import React from 'react';
import { presetGpnDark, Theme } from '@gpn-prototypes/vega-ui';

import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Navigation } from './components/Navigation/Navigation';

import './App.css';
/* TODO: create global main.css */
import './styles/colors.css';

export const App = (): React.ReactElement => {
  return (
    <Theme className="App" preset={presetGpnDark}>
      <Header />
      <Navigation />
      <Main />
    </Theme>
  );
};
