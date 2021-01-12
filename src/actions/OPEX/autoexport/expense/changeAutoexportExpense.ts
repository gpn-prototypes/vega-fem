import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { CHANGE_AUTOEXPORT_EXPENSE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';

export const OPEX_AUTOEXPORT_CHANGE_EXPENSE_INIT = 'OPEX_AUTOEXPORT_CHANGE_EXPENSE_INIT';
export const OPEX_AUTOEXPORT_CHANGE_EXPENSE_SUCCESS = 'OPEX_AUTOEXPORT_CHANGE_EXPENSE_SUCCESS';
export const OPEX_AUTOEXPORT_CHANGE_EXPENSE_ERROR = 'OPEX_AUTOEXPORT_CHANGE_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAutoexportChangeExpenseInit = (): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_INIT,
});

const OPEXAutoexportChangeExpenseSuccess = (expense: Article): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_SUCCESS,
  payload: expense,
});

const OPEXAutoexportChangeExpenseError = (message: any): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_ERROR,
  errorMessage: message,
});

export function autoexportChangeExpense(
  article: Article,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAutoexportChangeExpenseInit());

    mutate({
      query: CHANGE_AUTOEXPORT_EXPENSE,
      variables: {
        expenseId: article.id?.toString(),
        name: article.name?.toString(),
        caption: article.caption?.toString(),
        unit: article.unit?.toString(),
        value: article.value,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.changeOpexAutoexportExpense;

        if (responseData && responseData.opexExpense?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXAutoexportChangeExpenseSuccess(responseData.opexExpense));
        } else if (responseData?.opexExpense?.__typename === 'Error') {
          dispatch(OPEXAutoexportChangeExpenseError(responseData?.opexExpense));
        }
      })
      .catch((e) => {
        dispatch(OPEXAutoexportChangeExpenseError(e));
      });
  };
}
