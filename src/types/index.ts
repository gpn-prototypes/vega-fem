import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export type PossibleCloseEvent = MouseEvent | KeyboardEvent | TouchEvent | Event | React.MouseEvent;

export type Identity = {
  getToken(): Promise<string>;
};

type ProjectVID = string;

interface Project {
  vid: ProjectVID;
}

export interface CurrentProject {
  get(): Project;
}

export interface ShellToolkit {
  graphqlClient?: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
  currentProject?: CurrentProject;
}
