import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { OPEXGroup } from '../../../types/OPEX/OPEXGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

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

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {changeOpexMkos(` +
            `yearEnd: ${MKOS.yearEnd.toString()},` +
            `){mkos{yearStart,yearEnd,opexExpenseList{id,caption,name,value{year,value},valueTotal,unit}}, ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(OPEXMKOSChangeSuccess(body.data?.changeOpexMkos?.mkos));
      } else {
        dispatch(OPEXMKOSChangeError(body.message));
      }
    } catch (e) {
      dispatch(OPEXMKOSChangeError(e));
    }
  };
}
