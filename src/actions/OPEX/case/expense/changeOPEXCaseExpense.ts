import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
import Article from '@/types/Article';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

export const OPEX_CASE_CHANGE_EXPENSE_INIT = 'OPEX_CASE_CHANGE_EXPENSE_INIT';
export const OPEX_CASE_CHANGE_EXPENSE_SUCCESS = 'OPEX_CASE_CHANGE_EXPENSE_SUCCESS';
export const OPEX_CASE_CHANGE_EXPENSE_ERROR = 'OPEX_CASE_CHANGE_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXCaseChangeExpenseInit = (): OPEXAction => ({
  type: OPEX_CASE_CHANGE_EXPENSE_INIT,
});

const OPEXCaseChangeExpenseSuccess = (group: OPEXGroup, expense: Article): OPEXAction => ({
  type: OPEX_CASE_CHANGE_EXPENSE_SUCCESS,
  payload: { group, expense },
});

const OPEXCaseChangeExpenseError = (message: any): OPEXAction => ({
  type: OPEX_CASE_CHANGE_EXPENSE_ERROR,
  errorMessage: message,
});

export function caseChangeExpense(
  article: Article,
  group: OPEXGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXCaseChangeExpenseInit());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation changeOpexCaseExpense{
              changeOpexCaseExpense(
                caseId: ${group.id?.toString()},
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

      if (
        response.status === 200 &&
        body.data.changeOpexCaseExpense.opexExpense?.__typename !== 'Error'
      ) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(
          OPEXCaseChangeExpenseSuccess(group, body.data?.changeOpexCaseExpense?.opexExpense),
        );
      } else {
        dispatch(OPEXCaseChangeExpenseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXCaseChangeExpenseError(e));
    }
  };
}
