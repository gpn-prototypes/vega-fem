import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import { ProjectProvider } from './ProjectProvider';

import { vegaApi } from '@/api/api-clients/vega-api';
import store from '@/store/store';
import { ShellToolkit } from '@/types';

export const Providers: React.FC<ShellToolkit> = (props) => {
  const { graphqlClient = vegaApi, currentProject, children, identity } = props;

  return (
    <Provider store={store}>
      <ApolloProvider client={graphqlClient}>
        <BrowserRouter>
          <ProjectProvider
            graphqlClient={graphqlClient}
            identity={identity}
            currentProject={currentProject}
          >
            {children}
          </ProjectProvider>
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  );
};
