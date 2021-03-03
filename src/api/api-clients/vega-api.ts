import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';

import { authHeader } from '../../helpers/authTokenToLocalstorage';

import { config } from '@/config.public';

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...authHeader(),
};

export const vegaApi = new ApolloClient({
  link: new HttpLink({ uri: `${config.baseApiUrl}/graphql`, headers, fetch }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          logic: {
            merge: false,
          },
          domain: {
            merge: false,
          },
        },
      },
    },
  }),
});
