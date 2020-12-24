import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { setAlertNotification } from '@/actions/notifications';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';
import Article from '@/types/Article';

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
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation deleteOpexMkosExpense{
              deleteOpexMkosExpense(
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
      const responseData = body?.data?.deleteOpexMkosExpense;

      if (response.status === 200 && responseData?.result?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXMKOSDeleteExpenseSuccess(article));
      } else {
        dispatch(OPEXMKOSDeleteExpenseError(body.message));
        if (responseData?.result?.__typename === 'Error') {
          dispatch(setAlertNotification(responseData.result.message));
        } else {
          dispatch(setAlertNotification('Серверная ошибка'));
        }
      }
    } catch (e) {
      dispatch(OPEXMKOSDeleteExpenseError(e));
      dispatch(setAlertNotification('Серверная ошибка'));
    }
  };
}
