import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { ADD_AUTOEXPORT_EXPENSE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';

export const OPEX_ADD_AUTOEXPORT_EXPENSE_INIT = 'OPEX_ADD_AUTOEXPORT_EXPENSE_INIT';
export const OPEX_ADD_AUTOEXPORT_EXPENSE_SUCCESS = 'OPEX_ADD_AUTOEXPORT_EXPENSE_SUCCESS';
export const OPEX_ADD_AUTOEXPORT_EXPENSE_ERROR = 'OPEX_ADD_AUTOEXPORT_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAddAutoexportExpenseInit = (): OPEXAction => ({
  type: OPEX_ADD_AUTOEXPORT_EXPENSE_INIT,
});

const OPEXAddAutoexportExpenseSuccess = (expense: Article): OPEXAction => ({
  type: OPEX_ADD_AUTOEXPORT_EXPENSE_SUCCESS,
  payload: expense,
});

const OPEXAddAutoexportExpenseError = (message: any): OPEXAction => ({
  type: OPEX_ADD_AUTOEXPORT_EXPENSE_ERROR,
  errorMessage: message,
});

export function addAutoexportExpense(
  article: Article,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAddAutoexportExpenseInit());

    mutate({
      query: ADD_AUTOEXPORT_EXPENSE,
      variables: {
        caption: article.caption?.toString(),
        unit: article.unit?.toString(),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.createOpexAutoexportExpense;
        if (responseData && responseData.opexExpense?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXAddAutoexportExpenseSuccess(responseData.opexExpense));
        } else {
          dispatch(OPEXAddAutoexportExpenseError('Error'));
        }
      })
      .catch((e) => {
        dispatch(OPEXAddAutoexportExpenseError(e));
      });
  };
}
