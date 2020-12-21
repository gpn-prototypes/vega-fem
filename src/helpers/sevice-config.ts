import { ApolloClient, FetchPolicy, NormalizedCacheObject } from '@apollo/client';

import { Identity } from '@/types';

export interface ServiceConfig {
  client?: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
  projectId: string;
  fetchPolicy: FetchPolicy;
  identityToken?: string;
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
};

export async function initServiceConfig({ identity, projectId }: ServiceInitProps): Promise<void> {
  serviceConfig.identity = identity;
  serviceConfig.projectId = projectId;

  serviceConfig.identityToken = await serviceConfig.identity?.getToken();
}
