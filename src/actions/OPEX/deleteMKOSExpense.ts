import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article from '../../../types/Article';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

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

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation {deleteOpexMkosExpense(expenseId: ${article.id?.toString()},){ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(OPEXMKOSDeleteExpenseSuccess(article));
      } else {
        dispatch(OPEXMKOSDeleteExpenseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXMKOSDeleteExpenseError(e));
    }
  };
}
