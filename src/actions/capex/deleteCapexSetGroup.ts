import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexExpenseSetGroup from '../../../types/CAPEX/CapexExpenseSetGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { CapexesAction } from './capexSet';

export const CAPEX_EXPENSE_SET_GROUP_DELETE_INIT = 'CAPEX_EXPENSE_SET_GROUP_DELETE_INIT';
export const CAPEX_EXPENSE_SET_GROUP_DELETE_SUCCESS = 'CAPEX_EXPENSE_SET_GROUP_DELETE_SUCCESS';
export const CAPEX_EXPENSE_SET_GROUP_DELETE_ERROR = 'CAPEX_EXPENSE_SET_GROUP_DELETE_ERROR';

const capexExpenseSetGroupDeleteInitialized = (): CapexesAction => ({
  type: CAPEX_EXPENSE_SET_GROUP_DELETE_INIT,
});

const capexExpenseSetGroupDeleteSuccess = (capexSet: CapexExpenseSetGroup): CapexesAction => ({
  type: CAPEX_EXPENSE_SET_GROUP_DELETE_SUCCESS,
  payload: capexSet,
});

const capexExpenseGroupDeleteError = (message: any): CapexesAction => ({
  type: CAPEX_EXPENSE_SET_GROUP_DELETE_ERROR,
  errorMessage: message,
});

export const deleteCapexSetGroup = (
  capexSetGroup: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexExpenseSetGroupDeleteInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {` +
            `deleteCapexExpenseGroup(` +
            `capexExpenseGroupId:"${capexSetGroup.id}",` +
            `){ok}` +
            `}`,
        }),
      });

      const body = await response.json();

      if (response.ok) {
        dispatch(capexExpenseSetGroupDeleteSuccess(capexSetGroup));
      } else {
        dispatch(capexExpenseGroupDeleteError(body.message));
      }
    } catch (e) {
      dispatch(capexExpenseGroupDeleteError(e));
    }
  };
};
