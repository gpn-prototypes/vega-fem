import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexSet from '../../../types/CapexSet';
import { authHeader } from '../../helpers/authTokenToLocalstorage';
import {projectIdFromLocalStorage} from '../../helpers/projectIdToLocalstorage';

export const CAPEX_SET_FETCH = 'CAPEX_SET_FETCH';
export const CAPEX_SET_SUCCESS = 'CAPEX_SET_SUCCESS';
export const CAPEX_SET_ERROR = 'CAPEX_SET_ERROR';

export const CAPEX_SET_SELECTED = 'CAPEX_SET_SELECTED';

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
      const response = await fetch('graphql/' + projectIdFromLocalStorage(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify({
          query:
            '{capex{years,yearStart,capexGlobalValueList{id,name,caption,value},capexExpenseGroupList{id,name,caption,' +
            'valueTotal,capexExpenseList{id,name,caption,valueTotal,value{year,value}}}}}',
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

export const selectCapexSet = (capexSet: CapexSet): CapexesAction => ({
  type: CAPEX_SET_SELECTED,
  payload: capexSet,
});
