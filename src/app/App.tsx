import React from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { Root } from '@gpn-prototypes/vega-ui';

import { AppView } from './AppView';

import './App.css';

import { Providers } from '@/providers';

interface AppProps {
  graphqlClient?: ApolloClient<NormalizedCacheObject>;
}

export const App: React.FC<AppProps> = (props) => {
  const { graphqlClient } = props;

  return (
    <Root className="FEM__App" initialPortals={[{ name: 'modalRoot' }]} defaultTheme="dark">
      <Providers graphqlClient={graphqlClient}>
        <AppView />
      </Providers>
    </Root>
  );
};
