import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexSetGlobalValue from '../../../types/CapexSetGlobalValue';
import { authHeader } from '../../helpers/authTokenToLocalstorage';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { CapexesAction } from './capexSet';

export const CAPEX_UPDATE_GLOBAL_VALUE_INIT = 'CAPEX_UPDATE_GLOBAL_VALUE_INIT';
export const CAPEX_UPDATE_GLOBAL_VALUE_SUCCESS = 'CAPEX_UPDATE_GLOBAL_VALUE_SUCCESS';
export const CAPEX_UPDATE_GLOBAL_VALUE_ERROR = 'CAPEX_UPDATE_GLOBAL_VALUE_ERROR';

const capexUpdateGlobalValueInitialized = (): CapexesAction => ({
  type: CAPEX_UPDATE_GLOBAL_VALUE_INIT,
});

const capexUpdateGlobalValueSuccess = (reserveValue: CapexSetGlobalValue): CapexesAction => ({
  type: CAPEX_UPDATE_GLOBAL_VALUE_SUCCESS,
  payload: reserveValue,
});

const capexUpdateGlobalValueError = (message: any): CapexesAction => ({
  type: CAPEX_UPDATE_GLOBAL_VALUE_ERROR,
  errorMessage: message,
});

export const requestUpdateCapexGlobalValue = (
  reserveValue: CapexSetGlobalValue,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexUpdateGlobalValueInitialized());

    try {
      /* TODO: set project id dynamically */
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify({
          query:
            `mutation {` +
            `updateCapexGlobalValue(` +
            `capexGlobalValueId:"${reserveValue?.id}",` +
            `value: ${reserveValue?.value}` +
            `){capexGlobalValue{id,name}, ok}` +
            `}`,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.capexGlobalValue;

      if (response.ok && responseData?.ok) {
        const newCapex = responseData?.capex;

        if (newCapex) {
          dispatch(capexUpdateGlobalValueSuccess(newCapex as CapexSetGlobalValue));
        }
      } else {
        dispatch(capexUpdateGlobalValueError(body.message));
      }
    } catch (e) {
      dispatch(capexUpdateGlobalValueError(e));
    }
  };
};
