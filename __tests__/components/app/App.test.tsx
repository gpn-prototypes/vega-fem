import React from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { render } from '@testing-library/react';

import { App } from '@/app/App';
import { serviceConfig } from '@/helpers/service-config';

jest.mock('@/app/AppView', () => {
  return {
    AppView: () => {
      return <div />;
    },
  };
});

const mockProjectId = 'mock id';

const renderApp = () => {
  const mockGraphqlClient = new ApolloClient({ cache: new InMemoryCache() });
  const mockIdentity = {
    getToken: (): Promise<string> => new Promise((resolve) => setTimeout(() => resolve('token'))),
  };

  const mockCurrentProject = {
    get: () => ({
      vid: mockProjectId,
    }),
  };

  return render(
    <App
      currentProject={mockCurrentProject}
      graphqlClient={mockGraphqlClient}
      identity={mockIdentity}
    />,
  );
};

describe('App', () => {
  test('рендерится без ошибок', () => {
    expect(renderApp).not.toThrow();
  });

  test('устанавливается project id', () => {
    renderApp();

    const { projectId } = serviceConfig;

    expect(projectId).toBe(mockProjectId);
  });
});
