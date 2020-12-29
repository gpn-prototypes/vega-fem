import { ApolloClient, FetchPolicy, FetchResult, NormalizedCacheObject } from '@apollo/client';

import { getCurrentVersion, setCurrentVersion } from './version';

import { Identity } from '@/types';

export type Data = FetchResult['data'];

export interface ServiceConfig {
  client?: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
  projectId: string;
  fetchPolicy: FetchPolicy;
  identityToken?: string;
  getDiffResolvingConfig: () => Data;
}

export interface ServiceInitProps {
  client?: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
  projectId: string;
  identityToken?: string;
}

export const serviceConfig: ServiceConfig = {
  projectId: '',
  fetchPolicy: 'no-cache',
  getDiffResolvingConfig: () => ({
    maxAttempts: 20,
    errorTypename: 'UpdateProjectInnerDiff',
    mergeStrategy: {
      default: 'smart',
    },
    projectAccessor: {
      fromDiffError: (data: Record<string, unknown>) => {
        return {
          remote: data.remoteProject,
          local: {
            vid: serviceConfig.projectId,
            version: getCurrentVersion(),
          },
        };
      },
      fromVariables: (vars: Record<string, any>) => ({
        ...vars,
      }),
      toVariables: (vars: Record<string, unknown>, patched: Record<string, any>) => {
        setCurrentVersion(patched.version);
        return {
          ...vars,
          ...patched,
          vid: vars.vid,
          version: patched.version,
        };
      },
    },
  }),
};

export async function initServiceConfig({
  identity,
  client,
  projectId,
}: ServiceInitProps): Promise<void> {
  serviceConfig.identity = identity;
  serviceConfig.projectId = projectId;
  serviceConfig.client = client;

  serviceConfig.identityToken = await serviceConfig.identity?.getToken();
}
