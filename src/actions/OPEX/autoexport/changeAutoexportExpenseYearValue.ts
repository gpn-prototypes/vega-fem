import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { CHANGE_AUTOEXPORT_EXPENSE_YEAR_VALUE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article, { ArticleValues } from '@/types/Article';

export const OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_INIT =
  'OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_INIT';
export const OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS =
  'OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS';
export const OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_ERROR =
  'OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAutoexportChangeExpenseYearValueInit = (): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_INIT,
});

const OPEXAutoexportChangeExpenseYearValueSuccess = (
  article: Article,
  value: ArticleValues,
): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS,
  payload: { article, value },
});

const OPEXAutoexportChangeExpenseYearValueError = (message: any): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_ERROR,
  errorMessage: message,
});

export function autoexportChangeExpenseYearValue(
  article: Article,
  value: ArticleValues,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAutoexportChangeExpenseYearValueInit());

    mutate({
      query: CHANGE_AUTOEXPORT_EXPENSE_YEAR_VALUE,
      variables: {
        expenseId: article.id?.toString(),
        year: value.year?.toString(),
        value: value.value?.toString(),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.setOpexAutoexportExpenseYearValue;
        if (responseData && responseData.opexExpense?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXAutoexportChangeExpenseYearValueSuccess(article, value));
        } else {
          dispatch(OPEXAutoexportChangeExpenseYearValueError('Error'));
        }
      })
      .catch((e) => {
        dispatch(OPEXAutoexportChangeExpenseYearValueError(e));
      });
  };
}
