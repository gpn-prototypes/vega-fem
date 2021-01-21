import {
  ApolloClient,
  ApolloQueryResult,
  createHttpLink,
  InMemoryCache,
  NetworkStatus,
} from '@apollo/client';
import { waitFor } from '@testing-library/react';
import fetch from 'cross-fetch';

import { FETCH_CAPEX } from '@/api/capex';
import { CHANGE_CAPEX_EXPENSE } from '@/api/capex/expense';
import { getGraphqlUri, mutate, query } from '@/api/graphql-request';
import { initServiceConfig, serviceConfig } from '@/helpers/service-config';

const mockURI = 'http://mock.test';
const mockProjectId = 'id';

jest.mock('@/config.public.ts', () => ({
  config: {
    baseApiUrl: mockURI,
  },
}));

describe('Graphql request test', () => {
  const mutationMock = jest.fn(
    (response) =>
      new Promise((resolve) => {
        setTimeout(() => resolve(response));
      }),
  );

  const queryMock = jest.fn(
    (response) =>
      new Promise<ApolloQueryResult<any>>((resolve) => {
        setTimeout(() =>
          resolve({
            data: response,
            loading: false,
            networkStatus: NetworkStatus.ready,
          }),
        );
      }),
  );

  beforeAll(() => {
    const client = new ApolloClient({
      link: createHttpLink({ uri: '/graphql', fetch }),
      cache: new InMemoryCache(),
    });

    jest.spyOn(client, 'mutate').mockImplementation(mutationMock);
    jest.spyOn(client, 'query').mockImplementation(queryMock);

    initServiceConfig({ client, projectId: mockProjectId });
  });

  test('формируется корректный uri', () => {
    waitFor(() => expect(getGraphqlUri()).toBe(`${mockURI}/graphql/${mockProjectId}`));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('производится вызов mutate c projectId из клиента apollo', () => {
    const mockQueryBody = {
      query: CHANGE_CAPEX_EXPENSE,
      variables: {
        id: mockProjectId,
      },
      appendProjectId: true,
    };

    mutate(mockQueryBody).then((response) => {
      waitFor(() => expect(response.context.uri).toBe(`${mockURI}/graphql/${mockProjectId}`));
      expect(response.context.projectDiffResolving).toBeDefined();
    });

    expect(mutationMock).toHaveBeenCalledTimes(1);
  });

  test('производится вызов mutate без projectId из клиента apollo', () => {
    const mockQueryBody = {
      query: CHANGE_CAPEX_EXPENSE,
      variables: {
        id: mockProjectId,
      },
      appendProjectId: false,
    };

    mutate(mockQueryBody).then((response) => {
      expect(response.context).toEqual({});
    });

    expect(mutationMock).toHaveBeenCalledTimes(1);
  });

  test('производится вызов query c projectId из клиента apollo', () => {
    const mockQueryBody = {
      query: FETCH_CAPEX,
      variables: {
        id: mockProjectId,
      },
      appendProjectId: true,
    };

    query(mockQueryBody).then((response) => {
      waitFor(() => expect(response.data.context.uri).toBe(`${mockURI}/graphql/${mockProjectId}`));
    });

    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  test('производится вызов query без projectId из клиента apollo', () => {
    const mockQueryBody = {
      query: FETCH_CAPEX,
      variables: {
        id: mockProjectId,
      },
      appendProjectId: false,
    };

    query(mockQueryBody).then((response) => {
      expect(response.data.context).toEqual({});
    });

    expect(queryMock).toHaveBeenCalledTimes(1);
  });
});
