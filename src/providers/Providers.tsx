import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { ProjectProvider } from './ProjectProvider';

import store from '@/store/store';
import { ShellToolkit } from '@/types';

// import { vegaApi } from '@/utils/api-clients/vega-api';

export const Providers: React.FC<ShellToolkit> = (props) => {
  const { currentProject, children, identity } = props;

  return (
    <Provider store={store}>
      {/* <ApolloProvider client={graphqlClient}> */}
      <BrowserRouter>
        <ProjectProvider identity={identity} currentProject={currentProject}>
          {children}
        </ProjectProvider>
      </BrowserRouter>
      {/* </ApolloProvider> */}
    </Provider>
  );
};
