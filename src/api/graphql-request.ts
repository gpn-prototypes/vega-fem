import { DocumentNode } from '@apollo/client';

import { config } from '@/config.public';
import { serviceConfig } from '@/helpers/sevice-config';

export type QueryBody = {
  query: DocumentNode;
  variables?: {
    [key: string]: unknown;
  };
  appendProjectId?: boolean;
};

export const getGraphqlUri = (projectId: string): string =>
  `${config.baseApiUrl}/graphql/${projectId}`;

export function mutate(body: QueryBody) {
  const context = body.appendProjectId ? { uri: getGraphqlUri(serviceConfig.projectId) } : {};

  return serviceConfig.client?.mutate({
    mutation: body.query,
    variables: body.variables,
    context,
  });
}

export async function query(body: QueryBody) {
  const context = body.appendProjectId ? { uri: getGraphqlUri(serviceConfig.projectId) } : {};

  return serviceConfig.client?.query({
    query: body.query,
    variables: body.variables,
    fetchPolicy: serviceConfig.fetchPolicy,
    context,
  });
}
