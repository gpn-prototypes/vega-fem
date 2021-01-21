import { ApolloClient, InMemoryCache } from '@apollo/client';

import { initServiceConfig, serviceConfig } from '@/helpers/service-config';
import { getCurrentVersion, setCurrentVersion } from '@/helpers/version';

const mockProjectVersion = 42;
const setCurrentVersionMock = jest.fn();

jest.mock('@/helpers/version', () => ({
  getCurrentVersion: jest.fn(),
  setCurrentVersion: jest.fn(),
}));

getCurrentVersion.mockImplementation(() => mockProjectVersion);
setCurrentVersion.mockImplementation(setCurrentVersionMock);

describe('Service Config', () => {
  const mockProjectId = 'mockProjectId';
  const mockToken = 'mock token';
  const mockClient = new ApolloClient({ cache: new InMemoryCache() });
  const mockIdentity = { getToken: jest.fn(() => mockToken) };

  beforeAll(() => {
    initServiceConfig({
      identity: mockIdentity,
      client: mockClient,
      projectId: mockProjectId,
    });
  });

  test('service config корректно инициализируется', () => {
    expect(serviceConfig.projectId).toBe(mockProjectId);
    expect(serviceConfig.client).toBeDefined();
    expect(serviceConfig.identityToken).toBe(mockToken);
  });

  describe('конфиг разрешения конфликтов', () => {
    const diffResolvingConfig = serviceConfig.getDiffResolvingConfig();

    test('конфиг разрешения конфликтов корректно формируется', () => {
      ['errorTypename', 'maxAttempts', 'mergeStrategy', 'projectAccessor'].forEach((prop) => {
        expect(diffResolvingConfig).toHaveProperty(prop);
      });
    });

    test('корректно берутся параметры из ошибки конфликта версий', () => {
      const params = diffResolvingConfig.projectAccessor.fromDiffError({ remoteProject: {} });

      expect(params.remote).toEqual({});
      expect(params.local).toEqual({
        vid: mockProjectId,
        version: mockProjectVersion,
      });
    });

    test('устанавливается актуальная версия при конфликте мутаций', () => {
      const params = diffResolvingConfig.projectAccessor.toVariables(
        { vid: mockProjectId },
        { version: mockProjectVersion + 1 },
      );

      expect(setCurrentVersionMock).toHaveBeenCalledTimes(1);
      expect(params.vid).toBe(mockProjectId);
      expect(params.version).toBe(mockProjectVersion + 1);
    });
  });
});
