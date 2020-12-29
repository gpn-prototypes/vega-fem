import React, { useEffect, useState } from 'react';

import { initServiceConfig } from '@/helpers/service-config';
import { ShellToolkit } from '@/types';

interface ProjectContextProps {
  projectId: string;
  initialized: boolean;
}

const ProjectContext = React.createContext<ProjectContextProps>({
  projectId: '',
  initialized: false,
});

const ProjectProvider: React.FC<ShellToolkit> = ({
  graphqlClient,
  children,
  identity,
  currentProject,
}) => {
  const [initialized, setInitialized] = useState(false);

  const projectId = currentProject?.get()?.vid || '';

  useEffect(() => {
    async function init() {
      await initServiceConfig({
        client: graphqlClient,
        projectId,
        identity,
      });
    }

    init();

    setInitialized(true);
  }, [identity, graphqlClient, projectId]);

  return (
    <ProjectContext.Provider value={{ projectId, initialized }}>{children}</ProjectContext.Provider>
  );
};

export { ProjectProvider, ProjectContext };
