import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
import Article from '@/types/Article';

export const OPEX_ADD_MKOS_EXPENSE_INIT = 'OPEX_ADD_MKOS_EXPENSE_INIT';
export const OPEX_ADD_MKOS_EXPENSE_SUCCESS = 'OPEX_ADD_MKOS_EXPENSE_SUCCESS';
export const OPEX_ADD_MKOS_EXPENSE_ERROR = 'OPEX_ADD_MKOS_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAddMKOSExpenseInit = (): OPEXAction => ({
  type: OPEX_ADD_MKOS_EXPENSE_INIT,
});

const OPEXAddMKOSExpenseSuccess = (expense: Article): OPEXAction => ({
  type: OPEX_ADD_MKOS_EXPENSE_SUCCESS,
  payload: expense,
});

const OPEXAddMKOSExpenseError = (message: any): OPEXAction => ({
  type: OPEX_ADD_MKOS_EXPENSE_ERROR,
  errorMessage: message,
});

export function addMKOSExpense(article: Article): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAddMKOSExpenseInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation createOpexMkosExpense{
              createOpexMkosExpense(
                caption: "${article.caption?.toString()}",
                unit: "${article.unit?.toString()}",
                version:${currentVersionFromSessionStorage()}
              ){
              opexExpense{
                __typename
                ... on OpexExpense{
                  id
                  name
                  caption
                  unit
                  valueTotal
                  value{
                      year
                      value
                  }
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
        body.data.createOpexMkosExpense.opexExpense?.__typename !== 'Error'
      ) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXAddMKOSExpenseSuccess(body.data?.createOpexMkosExpense?.opexExpense));
      } else {
        dispatch(OPEXAddMKOSExpenseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAddMKOSExpenseError(e));
    }
  };
}
