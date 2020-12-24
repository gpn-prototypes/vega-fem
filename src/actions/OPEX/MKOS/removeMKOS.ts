import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { setAlertNotification } from '@/actions/notifications';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

export const OPEX_MKOS_REMOVE_INIT = 'OPEX_MKOS_REMOVE_INIT';
export const OPEX_MKOS_REMOVE_SUCCESS = 'OPEX_MKOS_REMOVE_SUCCESS';
export const OPEX_MKOS_REMOVE_ERROR = 'OPEX_MKOS_REMOVE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXMKOSRemoveInit = (): OPEXAction => ({
  type: OPEX_MKOS_REMOVE_INIT,
});

const OPEXMKOSRemoveSuccess = (mkos: OPEXGroup): OPEXAction => ({
  type: OPEX_MKOS_REMOVE_SUCCESS,
  payload: mkos,
});

const OPEXMKOSRemoveError = (message: any): OPEXAction => ({
  type: OPEX_MKOS_REMOVE_ERROR,
  errorMessage: message,
});

export function MKOSRemove(MKOS: OPEXGroup): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXMKOSRemoveInit());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation removeOpexMkos{
              removeOpexMkos(version:${currentVersionFromSessionStorage()} ){
                __typename
                ...on Error{
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
      const responseData = body?.data?.removeOpexMkos;

      if (response.status === 200 && responseData?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXMKOSRemoveSuccess(MKOS));
      } else {
        dispatch(OPEXMKOSRemoveError(body.message));
        if (responseData?.__typename === 'Error') {
          dispatch(setAlertNotification(responseData.message));
        } else {
          dispatch(setAlertNotification('Серверная ошибка'));
        }
      }
    } catch (e) {
      dispatch(OPEXMKOSRemoveError(e));
      dispatch(setAlertNotification('Серверная ошибка'));
    }
  };
}
