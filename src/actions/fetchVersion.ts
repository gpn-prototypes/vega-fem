import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { clearStores } from './clear';
import { setAlertNotification } from './notifications';

import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';

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
    dispatch(clearStores());
    dispatch(VersionFetchInit());

    try {
      const response = await fetch(`${graphqlRequestUrl}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `{
              project(vid:"${serviceConfig.projectId}") {
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
        const { errors } = body;
        if (
          Array.isArray(errors) &&
          errors.find((error) => error.message === 'badly formed hexadecimal UUID string')
        ) {
          const message = 'В url не корректный UUID проекта';
          dispatch(setAlertNotification(message));
        }
        dispatch(VersionFetchError(body.message));
      }
    } catch (e) {
      dispatch(VersionFetchError(e));
    }
  };
}
