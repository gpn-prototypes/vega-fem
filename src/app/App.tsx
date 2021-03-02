import React from 'react';
import { Root } from '@gpn-prototypes/vega-ui';

import { AppView } from './AppView';

import './App.css';

import { Providers } from '@/providers';
import { ShellToolkit } from '@/types';

export const App: React.FC<ShellToolkit> = (props) => {
  const { graphqlClient, identity, currentProject } = props;

  return (
    <Root className="FEM__App" initialPortals={[{ name: 'modalRoot' }]} defaultTheme="dark">
      <Providers graphqlClient={graphqlClient} identity={identity} currentProject={currentProject}>
        <AppView />
      </Providers>
    </Root>
  );
};
