import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
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

    try {
      const response = await fetch(`${graphqlRequestUrl}/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation changeOpexAutoexportExpense{
              changeOpexAutoexportExpense(
                expenseId: ${article.id?.toString()},
                name: "${article.name?.toString()}",
                caption: "${article.caption?.toString()}",
                unit: "${article.unit?.toString()}",
                ${article.value ? `value:${article.value},` : ''}
                version:${currentVersionFromSessionStorage()}
              ){
                opexExpense{
                  __typename
                  ... on OpexExpense{
                    id,
                    name,
                    caption,
                    unit,
                    valueTotal,
                    value{
                      year,
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
        body.data.changeOpexAutoexportExpense.opexExpense?.__typename !== 'Error'
      ) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(
          OPEXAutoexportChangeExpenseSuccess(body.data?.changeOpexAutoexportExpense?.opexExpense),
        );
      } else {
        dispatch(OPEXAutoexportChangeExpenseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAutoexportChangeExpenseError(e));
    }
  };
}
