import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import OPEXSetType from '../../../types/OPEX/OPEXSetType';
import headers from '../../helpers/headers';
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

const OPEXSetSuccess = (OPEXSetInstance: OPEXSetType): OPEXAction => ({
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
        headers: headers(),
        body: JSON.stringify({
          query:
            '{opex{' +
            'hasAutoexport,' +
            'autoexport{yearStart, yearEnd, opexExpenseList{id, name, caption, unit, valueTotal, value{year, value}}}' +
            'hasMkos,' +
            'mkos{yearStart, yearEnd, opexExpenseList{id, name, caption, unit, valueTotal, value{year, value}}}' +
            'opexCaseList{yearStart, yearEnd, id, name, caption, opexExpenseList{id, name, caption, unit, valueTotal, value{year, value}}}' +
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
