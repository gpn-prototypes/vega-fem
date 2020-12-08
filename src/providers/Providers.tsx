import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { ProjectProvider } from './ProjectProvider';

import store from '@/store/store';

// import { vegaApi } from '@/utils/api-clients/vega-api';

interface ProvidersProps {
  graphqlClient?: ApolloClient<NormalizedCacheObject>;
}

export const Providers: React.FC<ProvidersProps> = (props) => {
  const { children } = props;

  return (
    <Provider store={store}>
      {/* <ApolloProvider client={graphqlClient}> */}
      <BrowserRouter>
        <Route
          path="/projects/show/:projectId/fem"
          render={() => <ProjectProvider>{children}</ProjectProvider>}
        />
      </BrowserRouter>
      {/* </ApolloProvider> */}
    </Provider>
  );
};