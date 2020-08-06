import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import OPEXSetType from '../../../types/OPEX/OPEXSetType';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

export const OPEX_SET_CHANGE_INIT = 'OPEX_SET_CHANGE_INIT';
export const OPEX_SET_CHANGE_SUCCESS = 'OPEX_SET_CHANGE_SUCCESS';
export const OPEX_SET_CHANGE_ERROR = 'OPEX_SET_CHANGE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXSetChangeInit = (): OPEXAction => ({
  type: OPEX_SET_CHANGE_INIT,
});

const OPEXSetChangeSuccess = (OPEXSetInstance: OPEXSetType): OPEXAction => ({
  type: OPEX_SET_CHANGE_SUCCESS,
  payload: OPEXSetInstance,
});

const OPEXSetChangeError = (message: any): OPEXAction => ({
  type: OPEX_SET_CHANGE_ERROR,
  errorMessage: message,
});

export function changeOPEXSet(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXSetChangeInit());

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
        dispatch(OPEXSetChangeSuccess(body.data?.opex));
      } else {
        dispatch(OPEXSetChangeError(body.message));
      }
    } catch (e) {
      dispatch(OPEXSetChangeError(e));
    }
  };
}
