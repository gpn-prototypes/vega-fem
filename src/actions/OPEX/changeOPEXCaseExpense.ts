import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article from '../../../types/Article';
import { OPEXGroup } from '../../../types/OPEX/OPEXGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

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
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {changeOpexCaseExpense(` +
            `caseId: ${group.id?.toString()},` +
            `expenseId: ${article.id?.toString()},` +
            `name: "${article.name?.toString()}",` +
            `caption: "${article.caption?.toString()}",` +
            `unit: "${article.unit?.toString()}",` +
            `${article.value ? `value:${article.value},` : ''}` +
            `){opexExpense{id,name,caption,unit,valueTotal,value{year,value}}, ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
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
