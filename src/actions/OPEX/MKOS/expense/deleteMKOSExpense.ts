import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { DELETE_MKOS_EXPENSE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';

export const OPEX_MKOS_DELETE_EXPENSE_INIT = 'OPEX_MKOS_DELETE_EXPENSE_INIT';
export const OPEX_MKOS_DELETE_EXPENSE_SUCCESS = 'OPEX_MKOS_DELETE_EXPENSE_SUCCESS';
export const OPEX_MKOS_DELETE_EXPENSE_ERROR = 'OPEX_MKOS_DELETE_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXMKOSDeleteExpenseInit = (): OPEXAction => ({
  type: OPEX_MKOS_DELETE_EXPENSE_INIT,
});

const OPEXMKOSDeleteExpenseSuccess = (expense: Article): OPEXAction => ({
  type: OPEX_MKOS_DELETE_EXPENSE_SUCCESS,
  payload: expense,
});

const OPEXMKOSDeleteExpenseError = (message: any): OPEXAction => ({
  type: OPEX_MKOS_DELETE_EXPENSE_ERROR,
  errorMessage: message,
});

export function MKOSDeleteExpense(article: Article): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXMKOSDeleteExpenseInit());

    mutate({
      query: DELETE_MKOS_EXPENSE,
      variables: {
        expenseId: 2,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.deleteOpexMkosExpense;

        if (responseData && responseData.result?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXMKOSDeleteExpenseSuccess(article));
        } else if (responseData?.result?.__typename === 'Error') {
          dispatch(OPEXMKOSDeleteExpenseError(responseData?.result));
        }
      })
      .catch((e) => {
        dispatch(OPEXMKOSDeleteExpenseError(e));
      });
  };
}
