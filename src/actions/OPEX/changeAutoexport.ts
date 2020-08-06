import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import OPEXSet from '../../../types/OPEX/OPEXSet';
import { authHeader } from '../../helpers/authTokenToLocalstorage';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

export const OPEX_SET_FETCH = 'OPEX_SET_FETCH';
export const OPEX_SET_SUCCESS = 'OPEX_SET_SUCCESS';
export const OPEX_SET_ERROR = 'OPEX_SET_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXSetFetchInit = (): OPEXAction => ({
  type: OPEX_SET_FETCH,
});

const OPEXSetSuccess = (OPEXSetInstance: OPEXSet): OPEXAction => ({
  type: OPEX_SET_SUCCESS,
  payload: OPEXSetInstance,
});

const OPEXSetError = (message: any): OPEXAction => ({
  type: OPEX_SET_ERROR,
  errorMessage: message,
});

export function fetchOPEXSet(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXSetFetchInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify({
          query:
            '{opex{' +
            'hasAutoexport,' +
            'autoexport{yearStart, yearEnd, opexExpenseList{id, name, caption, unit, value{year, value}}}' +
            'hasMkos,' +
            'mkos{yearStart, yearEnd, opexExpenseList{id, name, caption, unit, value{year, value}}}' +
            'opexCaseList{yearStart, yearEnd, id, name, caption, opexExpenseList{id, name, caption, unit, value{year, value}}}' +
            '}}',
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(OPEXSetSuccess(body.data?.opex));
      } else {
        dispatch(OPEXSetError(body.message));
      }
    } catch (e) {
      dispatch(OPEXSetError(e));
    }
  };
}
