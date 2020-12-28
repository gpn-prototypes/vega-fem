import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { CapexesAction } from './fetchCAPEX';

import { DELETE_CAPEX_EXPENSE_GROUP } from '@/api/capex';
import { mutate } from '@/api/graphql-request';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';

export const CAPEX_EXPENSE_GROUP_DELETE_INIT = 'CAPEX_EXPENSE_GROUP_DELETE_INIT';
export const CAPEX_EXPENSE_GROUP_DELETE_SUCCESS = 'CAPEX_EXPENSE_GROUP_DELETE_SUCCESS';
export const CAPEX_EXPENSE_GROUP_DELETE_ERROR = 'CAPEX_EXPENSE_GROUP_DELETE_ERROR';

const capexExpenseGroupDeleteInitialized = (): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_DELETE_INIT,
});

const capexExpenseGroupDeleteSuccess = (capexSet: CapexExpenseSetGroup): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_DELETE_SUCCESS,
  payload: capexSet,
});

const capexExpenseGroupDeleteError = (message: any): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_DELETE_ERROR,
  errorMessage: message,
});

export const deleteCapexExpenseGroup = (
  capexSetGroup: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexExpenseGroupDeleteInitialized());

    mutate({
      query: DELETE_CAPEX_EXPENSE_GROUP,
      variables: {
        capexExpenseGroupId: capexSetGroup.id,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.deleteCapexExpenseGroup;
        if (responseData && responseData.result?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(capexExpenseGroupDeleteSuccess(capexSetGroup));
        } else {
          dispatch(capexExpenseGroupDeleteError('Error'));
        }
      })
      .catch((e) => {
        dispatch(capexExpenseGroupDeleteError(e));
      });
  };
};
