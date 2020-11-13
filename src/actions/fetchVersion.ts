import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import headers from '../helpers/headers';
import { projectIdFromLocalStorage } from '../helpers/projectIdToLocalstorage';

export const VERSION_FETCH = 'VERSION_FETCH';
export const VERSION_SUCCESS = 'VERSION_SUCCESS';
export const VERSION_ERROR = 'VERSION_ERROR';

export interface VersionAction {
  type: string;
  payload?: string;
  errorMessage?: any;
}

const VersionFetchInit = (): VersionAction => ({
  type: VERSION_FETCH,
});

const VersionFetchSuccess = (version: string): VersionAction => ({
  type: VERSION_SUCCESS,
  payload: version,
});

const VersionFetchError = (message: any): VersionAction => ({
  type: VERSION_ERROR,
  errorMessage: message,
});

export function fetchVersion(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(VersionFetchInit());

    try {
      const response = await fetch(`graphql`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `{
              project(vid:"${projectIdFromLocalStorage()}") {
                __typename
                ... on Project {
                  name
                  version
                  versions
                }
                ... on Error {
                  code
                  message
                  details
                  payload
                }
              }
            }`,
        }),
      });
      const body = await response.json();

      if (response.status === 200) {
        sessionStorage.setItem('currentVersion', body.data.project.version);
        dispatch(VersionFetchSuccess(body.data?.project.version));
      } else {
        dispatch(VersionFetchError(body.message));
      }
    } catch (e) {
      dispatch(VersionFetchError(e));
    }
  };
}
