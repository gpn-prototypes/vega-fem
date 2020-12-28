import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { defaultTo } from 'lodash';

import { initServiceConfig } from '@/helpers/sevice-config';
import { Identity } from '@/types';

const ROUTE_MATCH_PROJECT_ID = '/projects/show/:projectId';

interface MatchedData {
  projectId: string;
}

interface ProjectContextProps extends MatchedData {
  identity?: Identity;
  initialized: boolean;
}

interface ProjectProviderProps {
  graphqlClient: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
}

const ProjectContext = React.createContext<ProjectContextProps>({
  projectId: '',
  initialized: false,
});

const ProjectProvider: React.FC<ProjectProviderProps> = ({ children, graphqlClient, identity }) => {
  const [initialized, setInitialized] = useState(false);
  const matchedData = defaultTo<MatchedData>(
    useRouteMatch<MatchedData>(ROUTE_MATCH_PROJECT_ID)?.params,
    {
      projectId: '',
    },
  );

  useEffect(() => {
    async function init() {
      await initServiceConfig({
        client: graphqlClient,
        projectId: matchedData.projectId,
        identity,
      });
    }

    init();

    setInitialized(true);
  }, [identity, graphqlClient, matchedData]);

  return (
    <ProjectContext.Provider value={{ ...matchedData, identity, initialized }}>
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectProvider, ProjectContext };
