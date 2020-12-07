import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
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

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation setOpexAutoexportExpenseYearValue{
              setOpexAutoexportExpenseYearValue(
                expenseId: ${article.id},
                year:${value.year?.toString()},
                value: ${value.value?.toString()},
                version:${currentVersionFromSessionStorage()}
              ){
                opexExpense{
                  __typename
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
        body.data.setOpexAutoexportExpenseYearValue.opexExpense?.__typename
      ) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXAutoexportChangeExpenseYearValueSuccess(article, value));
      } else {
        dispatch(OPEXAutoexportChangeExpenseYearValueError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAutoexportChangeExpenseYearValueError(e));
    }
  };
}
