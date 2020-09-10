import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import CapexExpenseSetGroup from '../../../types/CAPEX/CapexExpenseSetGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { CapexesAction } from './capexSet';

export const CAPEX_EXPENSE_SET_GROUP_ADD_INIT = 'CAPEX_EXPENSE_SET_GROUP_ADD_INIT';
export const CAPEX_EXPENSE_SET_GROUP_ADD_SUCCESS = 'CAPEX_EXPENSE_SET_GROUP_ADD_SUCCESS';
export const CAPEX_EXPENSE_SET_GROUP_ADD_ERROR = 'CAPEX_EXPENSE_SET_GROUP_ADD_ERROR';

const capexExpenseSetGroupAddInitialized = (): CapexesAction => ({
  type: CAPEX_EXPENSE_SET_GROUP_ADD_INIT,
});

const capexExpenseSetGroupAddSuccess = (capexSet: CapexExpenseSetGroup): CapexesAction => ({
  type: CAPEX_EXPENSE_SET_GROUP_ADD_SUCCESS,
  payload: capexSet,
});

const capexExpenseGroupAddError = (message: any): CapexesAction => ({
  type: CAPEX_EXPENSE_SET_GROUP_ADD_ERROR,
  errorMessage: message,
});

export const addCapexSetGroup = (
  newCapexSetGroup: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexExpenseSetGroupAddInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {createCapexExpenseGroup(` +
            `caption: "${newCapexSetGroup.caption}", ` +
            `){capexExpenseGroup{id, name, caption}, ok}}`,
        }),
      });

      const body = await response.json();
      const createdCapexGroup = body?.data?.createCapexExpenseGroup;

      if (response.ok && createdCapexGroup?.ok) {
        const newGroup = createdCapexGroup?.capexExpenseGroup;
        if (newGroup)
          dispatch(
            capexExpenseSetGroupAddSuccess({
              ...newGroup,
              ...{ valueTotal: 0 },
              ...{ capexExpenseList: [] },
            } as CapexExpenseSetGroup),
          );
      } else {
        dispatch(capexExpenseGroupAddError(body.message));
      }
    } catch (e) {
      dispatch(capexExpenseGroupAddError(e));
    }
  };
};
