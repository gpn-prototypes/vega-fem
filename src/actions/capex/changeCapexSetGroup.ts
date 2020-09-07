import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexExpenseSetGroup from '../../../types/CAPEX/CapexExpenseSetGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { CapexesAction } from './capexSet';

export const CAPEX_EXPENSE_SET_GROUP_CHANGE_INIT = 'CAPEX_EXPENSE_SET_GROUP_CHANGE_INIT';
export const CAPEX_EXPENSE_SET_GROUP_CHANGE_SUCCESS = 'CAPEX_EXPENSE_SET_GROUP_CHANGE_SUCCESS';
export const CAPEX_EXPENSE_SET_GROUP_CHANGE_ERROR = 'CAPEX_EXPENSE_SET_GROUP_CHANGE_ERROR';

const capexExpenseSetGroupChangeInitialized = (): CapexesAction => ({
  type: CAPEX_EXPENSE_SET_GROUP_CHANGE_INIT,
});

const capexExpenseSetGroupChangeSuccess = (capexSet: CapexExpenseSetGroup): CapexesAction => ({
  type: CAPEX_EXPENSE_SET_GROUP_CHANGE_SUCCESS,
  payload: capexSet,
});

const capexExpenseGroupChangeError = (message: any): CapexesAction => ({
  type: CAPEX_EXPENSE_SET_GROUP_CHANGE_ERROR,
  errorMessage: message,
});

export const changeCapexSetGroup = (
  capexSetGroup: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexExpenseSetGroupChangeInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {` +
            `changeCapexExpenseGroup(` +
            `capexExpenseGroupId:"${capexSetGroup.id}",` +
            `caption:"${capexSetGroup.caption}"` +
            `){capexExpenseGroup{id,caption}, ok}` +
            `}`,
        }),
      });

      const body = await response.json();
      const changedCapexGroup = body?.data?.changeCapexExpenseGroup;

      if (response.ok && changedCapexGroup?.ok) {
        const newGroup = changedCapexGroup?.capexExpenseGroup;
        if (newGroup) console.log(newGroup);
        dispatch(capexExpenseSetGroupChangeSuccess({ ...newGroup } as CapexExpenseSetGroup));
      } else {
        dispatch(capexExpenseGroupChangeError(body.message));
      }
    } catch (e) {
      dispatch(capexExpenseGroupChangeError(e));
    }
  };
};
