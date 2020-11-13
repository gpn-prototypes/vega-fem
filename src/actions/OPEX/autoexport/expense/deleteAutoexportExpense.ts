import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article from '../../../../../types/Article';
import { currentVersionFromSessionStorage } from '../../../../helpers/currentVersionFromSessionStorage';
import headers from '../../../../helpers/headers';
import { projectIdFromLocalStorage } from '../../../../helpers/projectIdToLocalstorage';

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

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation deleteOpexAutoexportExpense{
              deleteOpexAutoexportExpense(
                expenseId: 2,
                version:${currentVersionFromSessionStorage()}
              ){
                result{
                  __typename
                  ... on Result{
                    vid
                  }
                  ... on Error{
                    code
                    message
                    details
                    payload
                  }
                }
              }
          }`,
        }),
      });
      const body = await response.json();

      if (
        response.status === 200 &&
        body.data.deleteOpexAutoexportExpense?.__typename !== 'Error'
      ) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXAutoexportDeleteExpenseSuccess(article));
      } else {
        dispatch(OPEXAutoexportDeleteExpenseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAutoexportDeleteExpenseError(e));
    }
  };
}
