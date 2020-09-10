import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexSet from '../../../types/CAPEX/CapexSet';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

export const CAPEX_SET_FETCH = 'CAPEX_SET_FETCH';
export const CAPEX_SET_SUCCESS = 'CAPEX_SET_SUCCESS';
export const CAPEX_SET_ERROR = 'CAPEX_SET_ERROR';

export interface CapexesAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const capexSetFetch = (): CapexesAction => ({
  type: CAPEX_SET_FETCH,
});

const capexSetSuccess = (capex: CapexSet): CapexesAction => ({
  type: CAPEX_SET_SUCCESS,
  payload: capex,
});

const capexSetError = (message: any): CapexesAction => ({
  type: CAPEX_SET_ERROR,
  errorMessage: message,
});

export function fetchCapexSet(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexSetFetch());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            '{capex{years,yearStart,capexGlobalValueList{id,name,caption,value},capexExpenseGroupList{id,name,caption,' +
            'valueTotal,capexExpenseList{id,name,caption,unit,valueTotal,value{year,value}},totalValueByYear{year, value}}}}',
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(capexSetSuccess(body.data?.capex));
      } else {
        dispatch(capexSetError(body.message));
      }
    } catch (e) {
      dispatch(capexSetError(e));
    }
  };
}
