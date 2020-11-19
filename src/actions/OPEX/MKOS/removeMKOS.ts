import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { OPEXGroup } from '../../../../types/OPEX/OPEXGroup';
import { currentVersionFromSessionStorage } from '../../../helpers/currentVersionFromSessionStorage';
import headers from '../../../helpers/headers';
import { projectIdFromLocalStorage } from '../../../helpers/projectIdToLocalstorage';

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
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation removeOpexMkos{
              removeOpexMkos(version:${currentVersionFromSessionStorage()} ){
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

      if (response.status === 200) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXMKOSRemoveSuccess(MKOS));
      } else {
        dispatch(OPEXMKOSRemoveError(body.message));
      }
    } catch (e) {
      dispatch(OPEXMKOSRemoveError(e));
    }
  };
}
