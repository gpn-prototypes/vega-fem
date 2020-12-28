import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { CHANGE_MKOS } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

export const OPEX_MKOS_CHANGE_INIT = 'OPEX_MKOS_CHANGE_INIT';
export const OPEX_MKOS_CHANGE_SUCCESS = 'OPEX_MKOS_CHANGE_SUCCESS';
export const OPEX_MKOS_CHANGE_ERROR = 'OPEX_MKOS_CHANGE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXMKOSChangeInit = (): OPEXAction => ({
  type: OPEX_MKOS_CHANGE_INIT,
});

const OPEXMKOSChangeSuccess = (mkos: OPEXGroup): OPEXAction => ({
  type: OPEX_MKOS_CHANGE_SUCCESS,
  payload: mkos,
});

const OPEXMKOSChangeError = (message: any): OPEXAction => ({
  type: OPEX_MKOS_CHANGE_ERROR,
  errorMessage: message,
});

export function MKOSChange(MKOS: OPEXGroup): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXMKOSChangeInit());

    mutate({
      query: CHANGE_MKOS,
      variables: {
        yearEnd: MKOS.yearEnd.toString(),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.changeOpexMkos;

        if (responseData && responseData.mkos?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXMKOSChangeSuccess(responseData.mkos));
        } else {
          dispatch(OPEXMKOSChangeError('Error'));
        }
      })
      .catch((e) => {
        dispatch(OPEXMKOSChangeError(e));
      });
  };
}
