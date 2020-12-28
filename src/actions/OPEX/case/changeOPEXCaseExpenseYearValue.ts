import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { CHANGE_OPEX_CASE_EXPENSE_YEAR_VALUE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article, { ArticleValues } from '@/types/Article';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

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

    mutate({
      query: CHANGE_OPEX_CASE_EXPENSE_YEAR_VALUE,
      variables: {
        caseId: group.id,
        expenseId: article.id?.toString(),
        year: value.year?.toString(),
        value: value.value?.toString(),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.setOpexCaseExpenseYearValue;
        if (responseData && responseData.opexExpense?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXChangeCaseExpenseYearValueSuccess(group, article, value));
        } else {
          dispatch(OPEXChangeCaseExpenseYearValueError('Error'));
        }
      })
      .catch((e) => {
        dispatch(OPEXChangeCaseExpenseYearValueError(e));
      });
  };
}
