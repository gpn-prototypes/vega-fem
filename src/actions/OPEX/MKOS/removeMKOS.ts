import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { REMOVE_MKOS } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
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

    mutate({
      query: REMOVE_MKOS,
      variables: {
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        if (!response?.data?.removeOpexMkos) {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXMKOSRemoveSuccess(MKOS));
        } else {
          dispatch(OPEXMKOSRemoveError('Error'));
        }
      })
      .catch((e) => {
        dispatch(OPEXMKOSRemoveError(e));
      });
  };
}
