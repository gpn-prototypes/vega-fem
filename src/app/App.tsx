import React from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { Root } from '@gpn-prototypes/vega-ui';

import { AppView } from './AppView';

import './App.css';

import { Providers } from '@/providers';
import { Identity } from '@/types';

interface AppProps {
  graphqlClient?: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
}

export const App: React.FC<AppProps> = (props) => {
  const { graphqlClient, identity } = props;

  return (
    <Root className="FEM__App" initialPortals={[{ name: 'modalRoot' }]} defaultTheme="dark">
      <Providers graphqlClient={graphqlClient} identity={identity}>
        <AppView />
      </Providers>
    </Root>
  );
};
