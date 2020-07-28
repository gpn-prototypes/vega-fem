import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexExpense from '../../../types/CapexExpense';
import CapexExpenseSetGroup from '../../../types/CapexExpenseSetGroup';
import { authHeader } from '../../helpers/authTokenToLocalstorage';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { CapexesAction } from './capexSet';

export const CAPEX_ADD_INIT = 'CAPEX_ADD_INIT';
export const CAPEX_ADD_SUCCESS = 'CAPEX_ADD_SUCCESS';
export const CAPEX_ADD_ERROR = 'CAPEX_ADD_ERROR';

const capexAddInitialized = (): CapexesAction => ({
  type: CAPEX_ADD_INIT,
});

const capexAddSuccess = (capex: CapexExpense, group: CapexExpenseSetGroup): CapexesAction => ({
  type: CAPEX_ADD_SUCCESS,
  payload: { capex, group },
});

const capexAddError = (message: any): CapexesAction => ({
  type: CAPEX_ADD_ERROR,
  errorMessage: message,
});

export const requestAddCapex = (
  newCapexExpense: CapexExpense,
  group: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexAddInitialized());

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
            `mutation {` +
            `createCapexExpense(` +
            `capexExpenseGroupId:"${group?.id?.toString()}",` +
            `caption:"${newCapexExpense.caption}",` +
            `unit:"${newCapexExpense.unit}",` +
            `){capexExpense{id, name, caption, unit, value{year,value}}, ok}}`,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.createCapexExpense;

      if (response.ok && responseData?.ok) {
        const capex = responseData?.capexExpense;

        if (capex) {
          dispatch(capexAddSuccess(capex as CapexExpense, group));
        }
      } else {
        dispatch(capexAddError(body.message));
      }
    } catch (e) {
      dispatch(capexAddError(e));
    }
  };
};
