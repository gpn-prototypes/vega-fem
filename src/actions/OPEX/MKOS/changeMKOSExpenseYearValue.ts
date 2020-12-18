import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
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

    try {
      const response = await fetch(`${graphqlRequestUrl}/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation setOpexMkosExpenseYearValue {
            project(version: ${currentVersionFromSessionStorage()}) {
              __typename
              ... on Error {
                code,
                message
              }
              ... on ProjectMutation {
                setOpexMkosExpenseYearValue(
                  expenseId: ${article.id},
                  year:${value.year?.toString()},
                  value: ${value.value?.toString()}
                ) {
                  opexExpense {
                    __typename
                    ... on Error {
                      code
                      message
                      details
                      payload
                    }
                  }
                }
              }
            }
          }`,
        }),
      });
      const body = await response.json();

      if (
        response.status === 200 &&
        body.data?.project?.setOpexMkosExpenseYearValue?.opexExpense?.__typename !== 'Error'
      ) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXMKOSChangeExpenseYearValueSuccess(article, value));
      } else {
        dispatch(OPEXMKOSChangeExpenseYearValueError(body.message));
      }
    } catch (e) {
      dispatch(OPEXMKOSChangeExpenseYearValueError(e));
    }
  };
}
