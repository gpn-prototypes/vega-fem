import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexExpense from '../../../types/CapexExpense';
import CapexExpenseSetGroup from '../../../types/CapexExpenseSetGroup';
import { authHeader } from '../../helpers/authTokenToLocalstorage';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { CapexesAction } from './capexSet';

export const CAPEX_UPDATE_VALUE_INIT = 'CAPEX_UPDATE_VALUE_INIT';
export const CAPEX_UPDATE_VALUE_SUCCESS = 'CAPEX_UPDATE_VALUE_SUCCESS';
export const CAPEX_UPDATE_VALUE_ERROR = 'CAPEX_UPDATE_VALUE_ERROR';

const capexUpdateValueInitialized = (): CapexesAction => ({
  type: CAPEX_UPDATE_VALUE_INIT,
});

const capexUpdateValueSuccess = (
  capex: CapexExpense,
  group: CapexExpenseSetGroup,
): CapexesAction => ({
  type: CAPEX_UPDATE_VALUE_SUCCESS,
  payload: { capex, group },
});

const capexUpdateValueError = (message: any): CapexesAction => ({
  type: CAPEX_UPDATE_VALUE_ERROR,
  errorMessage: message,
});

export const requestUpdateCapexValue = (
  capex: CapexExpense,
  group: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexUpdateValueInitialized());

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
            `mutation {changeCapexExpense(` +
            `capexExpenseGroupId: ${group?.id?.toString()},` +
            `capexExpenseId: ${capex.id},` +
            `value: ${capex.valueTotal}` +
            `){capexExpense{name, id, caption, value{year,value}}, ok}}`,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.changeCapexExpense;

      if (response.ok && responseData?.ok) {
        const newCapex = responseData?.capex;

        if (newCapex) {
          dispatch(capexUpdateValueSuccess(newCapex as CapexExpense, group));
        }
      } else {
        dispatch(capexUpdateValueError(body.message));
      }
    } catch (e) {
      dispatch(capexUpdateValueError(e));
    }
  };
};
