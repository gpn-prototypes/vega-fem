import React from 'react';
import { Provider } from 'react-redux';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import { VERSION_FETCH, VERSION_SUCCESS } from '@/actions/fetchVersion';
import { FETCH_VERSION } from '@/api/version';
import { AppView } from '@/app';
import { serviceConfig } from '@/helpers/service-config';
import { ProjectProvider } from '@/providers/ProjectProvider';
import { initialState as notificationInitState } from '@/reducers/notificationsReducer';
import { initialState as versionInitState } from '@/reducers/versionReducer';

const mockProjectId = 'mock project id';
const mockProjectName = 'mock project name';
const mockProjectVersion = 42;

jest.mock('react-router', () => {
  const originalModule = jest.requireActual('react-router');
  return {
    ...originalModule,
    useRouteMatch: jest.fn().mockImplementation(() => ({
      params: {
        projectId: mockProjectId,
      },
    })),
  };
});

jest.mock('@/components/Main/Main', () => {
  return {
    Main: () => {
      return <div data-testid="main" />;
    },
  };
});

jest.mock('@/components/Navigation/Navigation', () => {
  return {
    Navigation: () => {
      return <div data-testid="navigation" />;
    },
  };
});

const mockClient = new ApolloClient({ cache: new InMemoryCache() });
jest.mock('@/api/api-clients/vega-api', () => ({
  vegaApi: mockClient,
}));

const versionQueryMocs = [
  {
    request: {
      query: FETCH_VERSION,
      variables: {
        vid: mockProjectId,
      },
    },
    result: {
      data: {
        project: {
          __typename: 'Project',
          name: mockProjectName,
          version: mockProjectVersion,
          versions: [1, 2, 3],
        },
      },
    },
  },
];

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);
const storeData = {
  versionReducer: { ...versionInitState },
  notificationsReducer: { ...notificationInitState },
};

const TestProviders = ({ store, children }): React.ReactElement => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ProjectProvider graphqlClient={client}>{children}</ProjectProvider>
      </ApolloProvider>
    </Provider>
  );
};

const renderComponent = (mocks = [], store = mockStore(storeData)) =>
  render(
    <MockedProvider mocks={mocks}>
      <TestProviders store={store}>
        <AppView />
      </TestProviders>
    </MockedProvider>,
  );

beforeEach(() => {
  jest.clearAllMocks();
});

describe('App', () => {
  test('рендерится без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  test('отображается лоадер', () => {
    renderComponent();

    const loader: HTMLElement = screen.getByTestId('app-loader');
    expect(loader).toBeInTheDocument();
  });

  test('отображаются компоненты если версия загружена', () => {
    const store = mockStore({
      ...storeData,
      versionReducer: { version: mockProjectVersion },
    });
    renderComponent(versionQueryMocs, store);

    const main: HTMLElement = screen.getByTestId('main');
    expect(main).toBeInTheDocument();

    const navigation: HTMLElement = screen.getByTestId('navigation');
    expect(navigation).toBeInTheDocument();
  });

  test('инициализируется service config', () => {
    renderComponent(versionQueryMocs);

    waitFor(() => expect(serviceConfig.projectId).toBe(mockProjectId));
  });

  test('загружается версия проекта', () => {
    const store = mockStore(storeData);
    renderComponent(versionQueryMocs, store);

    waitFor(() => expect(store.getActions()).toContainEqual({ type: VERSION_FETCH }));

    waitFor(() => expect(store.getActions()).toContainEqual({ type: VERSION_SUCCESS }));

    const state = store.getState();
    waitFor(() =>
      expect(state.versionReducer).toEqual({
        version: mockProjectVersion,
        errorMessage: {},
      }),
    );
  });
});
