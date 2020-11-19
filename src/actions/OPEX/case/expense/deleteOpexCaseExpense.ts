import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article from '../../../../../types/Article';
import { OPEXGroup } from '../../../../../types/OPEX/OPEXGroup';
import { currentVersionFromSessionStorage } from '../../../../helpers/currentVersionFromSessionStorage';
import headers from '../../../../helpers/headers';
import { projectIdFromLocalStorage } from '../../../../helpers/projectIdToLocalstorage';

export const OPEX_CASE_DELETE_EXPENSE_INIT = 'OPEX_CASE_DELETE_EXPENSE_INIT';
export const OPEX_CASE_DELETE_EXPENSE_SUCCESS = 'OPEX_CASE_DELETE_EXPENSE_SUCCESS';
export const OPEX_CASE_DELETE_EXPENSE_ERROR = 'OPEX_CASE_DELETE_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXCaseDeleteExpenseInit = (): OPEXAction => ({
  type: OPEX_CASE_DELETE_EXPENSE_INIT,
});

const OPEXCaseDeleteExpenseSuccess = (group: OPEXGroup, expense: Article): OPEXAction => ({
  type: OPEX_CASE_DELETE_EXPENSE_SUCCESS,
  payload: { group, expense },
});

const OPEXCaseDeleteExpenseError = (message: any): OPEXAction => ({
  type: OPEX_CASE_DELETE_EXPENSE_ERROR,
  errorMessage: message,
});

export function caseDeleteExpense(
  article: Article,
  group: OPEXGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXCaseDeleteExpenseInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation deleteOpexCaseExpense{
              deleteOpexCaseExpense(
                caseId: ${group.id?.toString()},
                expenseId: ${article.id?.toString()},
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
        body.data.deleteOpexCaseExpense.result?.__typename !== 'Error'
      ) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXCaseDeleteExpenseSuccess(group, article));
      } else {
        dispatch(OPEXCaseDeleteExpenseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXCaseDeleteExpenseError(e));
    }
  };
}
