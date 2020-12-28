import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';

import { ProjectProvider } from './ProjectProvider';

import { vegaApi } from '@/api/api-clients/vega-api';
import store from '@/store/store';
import { Identity } from '@/types';

// import { vegaApi } from '@/utils/api-clients/vega-api';

interface ProvidersProps {
  graphqlClient?: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
}

export const Providers: React.FC<ProvidersProps> = (props) => {
  const { graphqlClient = vegaApi, children, identity } = props;

  return (
    <Provider store={store}>
      <ApolloProvider client={graphqlClient}>
        <BrowserRouter>
          <ProjectProvider graphqlClient={graphqlClient} identity={identity}>
            {children}
          </ProjectProvider>
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  );
};
