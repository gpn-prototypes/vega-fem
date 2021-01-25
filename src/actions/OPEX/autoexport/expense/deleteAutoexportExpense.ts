import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { DELETE_AUTOEXPORT_EXPENSE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';

export const OPEX_AUTOEXPORT_DELETE_EXPENSE_INIT = 'OPEX_AUTOEXPORT_DELETE_EXPENSE_INIT';
export const OPEX_AUTOEXPORT_DELETE_EXPENSE_SUCCESS = 'OPEX_AUTOEXPORT_DELETE_EXPENSE_SUCCESS';
export const OPEX_AUTOEXPORT_DELETE_EXPENSE_ERROR = 'OPEX_AUTOEXPORT_DELETE_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAutoexportDeleteExpenseInit = (): OPEXAction => ({
  type: OPEX_AUTOEXPORT_DELETE_EXPENSE_INIT,
});

const OPEXAutoexportDeleteExpenseSuccess = (expense: Article): OPEXAction => ({
  type: OPEX_AUTOEXPORT_DELETE_EXPENSE_SUCCESS,
  payload: expense,
});

const OPEXAutoexportDeleteExpenseError = (message: any): OPEXAction => ({
  type: OPEX_AUTOEXPORT_DELETE_EXPENSE_ERROR,
  errorMessage: message,
});

export function autoexportDeleteExpense(
  article: Article,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAutoexportDeleteExpenseInit());

    mutate({
      query: DELETE_AUTOEXPORT_EXPENSE,
      variables: {
        expenseId: 2,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.deleteOpexAutoexportExpense;

        if (responseData && responseData.result?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXAutoexportDeleteExpenseSuccess(article));
        } else if (responseData?.result?.__typename === 'Error') {
          dispatch(OPEXAutoexportDeleteExpenseError(responseData?.result));
        }
      })
      .catch((e) => {
        dispatch(OPEXAutoexportDeleteExpenseError(e));
      });
  };
}
