import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';
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

    try {
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation createOpexAutoexportExpense{
            createOpexAutoexportExpense(
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
      const responseData = body?.data?.createOpexAutoexportExpense;

      if (response.status === 200 && responseData?.opexExpense?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXAddAutoexportExpenseSuccess(responseData.opexExpense));
      } else {
        dispatch(OPEXAddAutoexportExpenseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAddAutoexportExpenseError(e));
    }
  };
}
