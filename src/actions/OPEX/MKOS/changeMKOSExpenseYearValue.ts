import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { CHANGE_MKOS_EXPENSE_YEAR_VALUE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article, { ArticleValues } from '@/types/Article';

export const OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_INIT = 'OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_INIT';
export const OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS =
  'OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS';
export const OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_ERROR =
  'OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXMKOSChangeExpenseYearValueInit = (): OPEXAction => ({
  type: OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_INIT,
});

const OPEXMKOSChangeExpenseYearValueSuccess = (
  article: Article,
  value: ArticleValues,
): OPEXAction => ({
  type: OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS,
  payload: { article, value },
});

const OPEXMKOSChangeExpenseYearValueError = (message: any): OPEXAction => ({
  type: OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_ERROR,
  errorMessage: message,
});

export function MKOSChangeExpenseYearValue(
  article: Article,
  value: ArticleValues,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXMKOSChangeExpenseYearValueInit());

    mutate({
      query: CHANGE_MKOS_EXPENSE_YEAR_VALUE,
      variables: {
        expenseId: article.id,
        year: value.year?.toString(),
        value: value.value?.toString(),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.setOpexMkosExpenseYearValue;

        if (responseData && responseData.opexExpense?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXMKOSChangeExpenseYearValueSuccess(article, value));
        } else {
          dispatch(OPEXMKOSChangeExpenseYearValueError('Error'));
        }
      })
      .catch((e) => {
        dispatch(OPEXMKOSChangeExpenseYearValueError(e));
      });
  };
}
