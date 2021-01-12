import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { CHANGE_MKOS_EXPENSE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';

export const OPEX_MKOS_CHANGE_EXPENSE_INIT = 'OPEX_MKOS_CHANGE_EXPENSE_INIT';
export const OPEX_MKOS_CHANGE_EXPENSE_SUCCESS = 'OPEX_MKOS_CHANGE_EXPENSE_SUCCESS';
export const OPEX_MKOS_CHANGE_EXPENSE_ERROR = 'OPEX_MKOS_CHANGE_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXMKOSChangeExpenseInit = (): OPEXAction => ({
  type: OPEX_MKOS_CHANGE_EXPENSE_INIT,
});

const OPEXMKOSChangeExpenseSuccess = (expense: Article): OPEXAction => ({
  type: OPEX_MKOS_CHANGE_EXPENSE_SUCCESS,
  payload: expense,
});

const OPEXMKOSChangeExpenseError = (message: any): OPEXAction => ({
  type: OPEX_MKOS_CHANGE_EXPENSE_ERROR,
  errorMessage: message,
});

export function MKOSChangeExpense(article: Article): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXMKOSChangeExpenseInit());

    mutate({
      query: CHANGE_MKOS_EXPENSE,
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
        const responseData = response?.data?.project?.changeOpexMkosExpense;

        if (responseData && responseData.opexExpense?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXMKOSChangeExpenseSuccess(responseData.opexExpense));
        } else if (responseData?.opexExpense?.__typename === 'Error') {
          dispatch(OPEXMKOSChangeExpenseError(responseData?.opexExpense));
        }
      })
      .catch((e) => {
        dispatch(OPEXMKOSChangeExpenseError(e));
      });
  };
}
