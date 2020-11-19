import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { presetGpnDark, Theme } from '@gpn-prototypes/vega-ui';

import { fetchVersion } from './actions/fetchVersion';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Navigation } from './components/Navigation/Navigation';

import './App.css';
/* TODO: create global main.css */
import './styles/colors.css';

export const App = (): React.ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchVersion());
  }, [dispatch]);

  return (
    <Theme className="App" preset={presetGpnDark}>
      <Header />
      <Navigation />
      <Main />
    </Theme>
  );
};
