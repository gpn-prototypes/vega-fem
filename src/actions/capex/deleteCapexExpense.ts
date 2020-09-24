import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article from '../../../types/Article';
import CapexExpenseSetGroup from '../../../types/CAPEX/CapexExpenseSetGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { CapexesAction } from './capexSet';

export const DELETE_CAPEX_EXPENSE_INIT = 'DELETE_CAPEX_EXPENSE_INIT';
export const DELETE_CAPEX_EXPENSE_SUCCESS = 'DELETE_CAPEX_EXPENSE_SUCCESS';
export const DELETE_CAPEX_EXPENSE_ERROR = 'DELETE_CAPEX_EXPENSE_ERROR';

const capexDeleteValueInitialized = (): CapexesAction => ({
  type: DELETE_CAPEX_EXPENSE_INIT,
});

const capexDeleteValueSuccess = (capex: Article, group: CapexExpenseSetGroup): CapexesAction => ({
  type: DELETE_CAPEX_EXPENSE_SUCCESS,
  payload: { capex, group },
});

const capexDeleteValueError = (message: any): CapexesAction => ({
  type: DELETE_CAPEX_EXPENSE_ERROR,
  errorMessage: message,
});

export const requestDeleteCapexExpense = (
  capex: Article,
  group: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexDeleteValueInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {` +
            `deleteCapexExpense(` +
            `capexExpenseGroupId:"${group?.id?.toString()}"` +
            `capexExpenseId:"${capex.id}"` +
            `){ok}` +
            `}`,
        }),
      });

      const body = await response.json();

      if (response.ok) {
        dispatch(capexDeleteValueSuccess(capex, group));
      } else {
        dispatch(capexDeleteValueError(body.message));
      }
    } catch (e) {
      dispatch(capexDeleteValueError(e));
    }
  };
};
