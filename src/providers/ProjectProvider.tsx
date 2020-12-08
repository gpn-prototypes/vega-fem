import React from 'react';
import { useRouteMatch } from 'react-router';
import { defaultTo } from 'lodash';

import { setProjectId } from '@/helpers/projectIdToLocalstorage';

const ROUTE_MATCH_PROJECT_ID = '/projects/show/:projectId';

type MatchedData = { projectId: string };

const ProjectContext = React.createContext<MatchedData>({ projectId: '' });

const ProjectProvider: React.FC = ({ children }) => {
  const matchedData = defaultTo<MatchedData>(
    useRouteMatch<MatchedData>(ROUTE_MATCH_PROJECT_ID)?.params,
    {
      projectId: '',
    },
  );

  setProjectId(matchedData.projectId);

  return <ProjectContext.Provider value={matchedData}>{children}</ProjectContext.Provider>;
};

export { ProjectProvider, ProjectContext };