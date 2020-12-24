import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { setAlertNotification } from '@/actions/notifications';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';
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
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
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
      const responseData = body?.data?.changeOpexAutoexportExpense;

      if (response.status === 200 && responseData?.opexExpense?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXAutoexportChangeExpenseSuccess(responseData?.opexExpense));
      } else {
        dispatch(OPEXAutoexportChangeExpenseError(body.message));
        if (responseData?.opexExpense?.__typename === 'Error') {
          dispatch(setAlertNotification(responseData.opexExpense.message));
        } else {
          dispatch(setAlertNotification('Серверная ошибка'));
        }
      }
    } catch (e) {
      dispatch(OPEXAutoexportChangeExpenseError(e));
      dispatch(setAlertNotification('Серверная ошибка'));
    }
  };
}
