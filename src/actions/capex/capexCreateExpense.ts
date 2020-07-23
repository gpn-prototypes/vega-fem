import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexExpense from '../../../types/CapexExpense';
import { authHeader } from '../../helpers/authTokenToLocalstorage';

import { CapexesAction } from './capexSet';

export const CAPEX_CREATE_EXPENSE_INIT = 'CAPEX_CREATE_EXPENSE_INIT';
export const CAPEX_CREATE_EXPENSE_SUCCESS = 'CAPEX_CREATE_EXPENSE_SUCCESS';
export const CAPEX_CREATE_EXPENSE_ERROR = 'CAPEX_CREATE_EXPENSE_ERROR';

const capexCreateExpenseInitialized = (): CapexesAction => ({
  type: CAPEX_CREATE_EXPENSE_INIT,
});

const capexCreateExpenseSuccess = (capexExpense: CapexExpense): CapexesAction => ({
  type: CAPEX_CREATE_EXPENSE_SUCCESS,
  payload: capexExpense,
});

const capexCreateExpenseError = (message: any): CapexesAction => ({
  type: CAPEX_CREATE_EXPENSE_ERROR,
  errorMessage: message,
});

export const capexCreateExpense = (
  newCapexExpense: CapexExpense,
  capexExpenseGroupId: number,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    // const { selected } = getState()?.capexReducer;
    dispatch(capexCreateExpenseInitialized());

    try {
      const response = await fetch('graphql/5edde72c45eb7b93ad30c0c3', {
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
            `capexExpenseGroupId:"${capexExpenseGroupId}",` +
            `caption:"${newCapexExpense.caption}",` +
            `unit:"${newCapexExpense.unit}",` +
            `value:${newCapexExpense.value}` +
            `){capexExpense{id,caption}, ok}` +
            `}`,
        }),
      });

      const body = await response.json();

      if (response.ok) {
        dispatch(
          capexCreateExpenseSuccess({
            ...newCapexExpense,
          } as CapexExpense),
        );
      } else {
        dispatch(capexCreateExpenseError(body.message));
      }
    } catch (e) {
      dispatch(capexCreateExpenseError(e));
    }
  };
};
