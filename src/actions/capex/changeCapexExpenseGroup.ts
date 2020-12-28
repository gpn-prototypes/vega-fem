import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { CapexesAction } from './fetchCAPEX';

import { CHANGE_CAPEX_EXPENSE_GROUP } from '@/api/capex';
import { mutate } from '@/api/graphql-request';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';

export const CAPEX_EXPENSE_GROUP_CHANGE_INIT = 'CAPEX_EXPENSE_GROUP_CHANGE_INIT';
export const CAPEX_EXPENSE_GROUP_CHANGE_SUCCESS = 'CAPEX_EXPENSE_GROUP_CHANGE_SUCCESS';
export const CAPEX_EXPENSE_GROUP_CHANGE_ERROR = 'CAPEX_EXPENSE_GROUP_CHANGE_ERROR';

const capexExpenseGroupChangeInitialized = (): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_CHANGE_INIT,
});

const capexExpenseGroupChangeSuccess = (capexSet: CapexExpenseSetGroup): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_CHANGE_SUCCESS,
  payload: capexSet,
});

const capexExpenseGroupChangeError = (message: any): CapexesAction => ({
  type: CAPEX_EXPENSE_GROUP_CHANGE_ERROR,
  errorMessage: message,
});

export const changeCapexExpenseGroup = (
  capexSetGroup: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexExpenseGroupChangeInitialized());

    mutate({
      query: CHANGE_CAPEX_EXPENSE_GROUP,
      variables: {
        capexExpenseGroupId: capexSetGroup.id,
        caption: capexSetGroup.caption,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const changedCapexGroup = response?.data?.changeCapexExpenseGroup;

        if (changedCapexGroup && changedCapexGroup?.capexExpenseGroup?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          const newGroup = changedCapexGroup?.capexExpenseGroup;
          dispatch(capexExpenseGroupChangeSuccess({ ...newGroup } as CapexExpenseSetGroup));
        } else {
          dispatch(capexExpenseGroupChangeError('Error'));
        }
      })
      .catch((e) => {
        dispatch(capexExpenseGroupChangeError(e));
      });
  };
};
