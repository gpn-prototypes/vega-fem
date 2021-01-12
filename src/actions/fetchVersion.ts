import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { clearStores } from './clear';
import { setAlertNotification } from './notifications';

import { query } from '@/api/graphql-request';
import { FETCH_VERSION } from '@/api/version';
import { serviceConfig } from '@/helpers/service-config';

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

    query({
      query: FETCH_VERSION,
      variables: {
        vid: serviceConfig.projectId,
      },
    })
      ?.then((response) => {
        const responseData = response?.data?.project;

        if (responseData && responseData?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', responseData.version);
          dispatch(VersionFetchSuccess(responseData.version));
        } else if (responseData?.__typename === 'Error') {
          dispatch(VersionFetchError(responseData));
        }
      })
      .catch((e) => {
        dispatch(VersionFetchError(e));
        const networkErrors = e?.networkError?.result?.errors;
        if (
          Array.isArray(networkErrors) &&
          networkErrors.find(
            (error: Error) => error.message === 'badly formed hexadecimal UUID string',
          )
        ) {
          const message = 'В url не корректный UUID проекта';
          dispatch(setAlertNotification(message));
        }
      });
  };
}
