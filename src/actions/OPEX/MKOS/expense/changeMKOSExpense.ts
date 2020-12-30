import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';
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

    try {
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation changeOpexMkosExpense{
              changeOpexMkosExpense(
                expenseId: ${article.id?.toString()},
                name: "${article.name?.toString()}",
                caption: "${article.caption?.toString()}",
                unit: "${article.unit?.toString()}",
                ${article.value ? `value:${article.value},` : ''},
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
      const responseData = body?.data?.changeOpexMkosExpense;

      if (response.status === 200 && responseData?.opexExpense?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXMKOSChangeExpenseSuccess(responseData.opexExpense));
      } else {
        dispatch(OPEXMKOSChangeExpenseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXMKOSChangeExpenseError(e));
    }
  };
}
