import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { setAlertNotification } from '@/actions/notifications';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';
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

    try {
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation setOpexCaseExpenseYearValue{
              setOpexCaseExpenseYearValue(
                caseId:${group.id},
                expenseId: ${article.id},
                year:${value.year?.toString()},
                value: ${value.value?.toString()},
                version:${currentVersionFromSessionStorage()}
              ){
                totalValueByYear{
                  year,
                  value
                }
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
      const responseData = body?.data?.setOpexCaseExpenseYearValue;

      if (response.status === 200 && responseData?.opexExpense?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXChangeCaseExpenseYearValueSuccess(group, article, value));
      } else {
        dispatch(OPEXChangeCaseExpenseYearValueError(body.message));
        if (responseData?.opexExpense?.__typename === 'Error') {
          dispatch(setAlertNotification(responseData.opexExpense.message));
        } else {
          dispatch(setAlertNotification('Серверная ошибка'));
        }
      }
    } catch (e) {
      dispatch(OPEXChangeCaseExpenseYearValueError(e));
      dispatch(setAlertNotification('Серверная ошибка'));
    }
  };
}
