import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { CapexesAction } from './fetchCAPEX';

import { setAlertNotification } from '@/actions/notifications';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';
import Article, { ArticleValues } from '@/types/Article';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';

export const CAPEX_UPDATE_YEAR_VALUE_INIT = 'CAPEX_UPDATE_YEAR_VALUE_INIT';
export const CAPEX_UPDATE_YEAR_VALUE_SUCCESS = 'CAPEX_UPDATE_YEAR_VALUE_SUCCESS';
export const CAPEX_UPDATE_YEAR_VALUE_ERROR = 'CAPEX_UPDATE_YEAR_VALUE_ERROR';

const capexUpdateYearValueInitialized = (): CapexesAction => ({
  type: CAPEX_UPDATE_YEAR_VALUE_INIT,
});

const capexUpdateYearValueSuccess = (
  capex: Article,
  group: CapexExpenseSetGroup,
  value: ArticleValues,
  groupTotalValueByYear: ArticleValues[],
): CapexesAction => ({
  type: CAPEX_UPDATE_YEAR_VALUE_SUCCESS,
  payload: { capex, group, value, groupTotalValueByYear },
});

const capexUpdateYearValueError = (message: any): CapexesAction => ({
  type: CAPEX_UPDATE_YEAR_VALUE_ERROR,
  errorMessage: message,
});

export const requestUpdateCapexYearValue = (
  capex: Article,
  group: CapexExpenseSetGroup,
  value: ArticleValues,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexUpdateYearValueInitialized());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation setCapexExpenseYearValue {
            setCapexExpenseYearValue(
              capexExpenseGroupId: ${group?.id?.toString()}
              capexExpenseId: ${capex.id}
              year: ${value.year}
              value: ${value.value}
              version:${currentVersionFromSessionStorage()}
            ) {
              totalValueByYear{
                year
                value
              }
              capexExpense {
                __typename
                ... on CapexExpense {
                  value {
                    year
                    value
                  }
                }
                ... on Error {
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
      const responseData = body?.data?.setCapexExpenseYearValue;
      const groupTotalValueByYear = responseData?.totalValueByYear;

      if (response.status === 200 && responseData?.capexExpense?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(
          capexUpdateYearValueSuccess(capex as Article, group, value, groupTotalValueByYear),
        );
      } else {
        dispatch(capexUpdateYearValueError(body.message));
        if (responseData?.capexExpense?.__typename === 'Error') {
          dispatch(setAlertNotification(responseData.capexExpense.message));
        } else {
          dispatch(setAlertNotification('Серверная ошибка'));
        }
      }
    } catch (e) {
      dispatch(capexUpdateYearValueError(e));
      dispatch(setAlertNotification('Серверная ошибка'));
    }
  };
};
