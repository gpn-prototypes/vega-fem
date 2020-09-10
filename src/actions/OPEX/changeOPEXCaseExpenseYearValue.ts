import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article, { ArticleValues } from '../../../types/Article';
import { OPEXGroup } from '../../../types/OPEX/OPEXGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

export const OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_INIT = 'OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_INIT';
export const OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_SUCCESS =
  'OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_SUCCESS';
export const OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_ERROR =
  'OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXChangeCaseExpenseYearValueInit = (): OPEXAction => ({
  type: OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_INIT,
});

const OPEXChangeCaseExpenseYearValueSuccess = (
  group: OPEXGroup,
  article: Article,
  value: ArticleValues,
): OPEXAction => ({
  type: OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_SUCCESS,
  payload: { group, article, value },
});

const OPEXChangeCaseExpenseYearValueError = (message: any): OPEXAction => ({
  type: OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_ERROR,
  errorMessage: message,
});

export function opexChangeCaseExpenseYearValue(
  group: OPEXGroup,
  article: Article,
  value: ArticleValues,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXChangeCaseExpenseYearValueInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {setOpexCaseExpenseYearValue(` +
            `caseId: ${group.id},` +
            `expenseId: ${article.id},` +
            `year: ${value.year?.toString()},` +
            `value: ${value.value?.toString()}` +
            `){ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(OPEXChangeCaseExpenseYearValueSuccess(group, article, value));
      } else {
        dispatch(OPEXChangeCaseExpenseYearValueError(body.message));
      }
    } catch (e) {
      dispatch(OPEXChangeCaseExpenseYearValueError(e));
    }
  };
}
