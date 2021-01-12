import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { CapexesAction } from '../fetchCAPEX';

import { DELETE_CAPEX_EXPENSE } from '@/api/capex';
import { mutate } from '@/api/graphql-request';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';

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

    mutate({
      query: DELETE_CAPEX_EXPENSE,
      variables: {
        capexExpenseGroupId: group?.id?.toString(),
        capexExpenseId: capex?.id?.toString(),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.deleteCapexExpense;

        if (responseData && responseData?.result?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(capexDeleteValueSuccess(capex, group));
        } else if (responseData?.result?.__typename === 'Error') {
          dispatch(capexDeleteValueError(responseData?.result));
        }
      })
      .catch((e) => {
        dispatch(capexDeleteValueError(e));
      });
  };
};
