import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexSetGlobalValue from '../../../types/CapexSetGlobalValue';
import { authHeader } from '../../helpers/authTokenToLocalstorage';
import {projectIdFromLocalStorage} from '../../helpers/projectIdToLocalstorage';

import { CapexesAction } from './capexSet';

export const CAPEX_SET_GLOBAL_VALUE_FETCH = 'CAPEX_SET_GLOBAL_VALUE_FETCH';
export const CAPEX_SET_GLOBAL_VALUE_SUCCESS = 'CAPEX_SET_GLOBAL_VALUE_SUCCESS';
export const CAPEX_SET_GLOBAL_VALUE_ERROR = 'CAPEX_SET_GLOBAL_VALUE_ERROR';

const capexSetGlobalValueFetch = (): CapexesAction => ({
  type: CAPEX_SET_GLOBAL_VALUE_FETCH,
});

const capexSetGlobalValueSuccess = (capexGlobalValue: CapexSetGlobalValue): CapexesAction => ({
  type: CAPEX_SET_GLOBAL_VALUE_SUCCESS,
  payload: capexGlobalValue,
});

const capexSetGlobalValueError = (message: any): CapexesAction => ({
  type: CAPEX_SET_GLOBAL_VALUE_ERROR,
  errorMessage: message,
});

export function fetchCapexGlobalValueSet(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexSetGlobalValueFetch());

    try {
      const response = await fetch('graphql/' + projectIdFromLocalStorage(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify({
          query: `{capex{capexGlobalValue(name:"reserveValue"){id,name,value}}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(capexSetGlobalValueSuccess(body.data?.capex));
      } else {
        dispatch(capexSetGlobalValueError(body.message));
      }
    } catch (e) {
      dispatch(capexSetGlobalValueError(e));
    }
  };
}
