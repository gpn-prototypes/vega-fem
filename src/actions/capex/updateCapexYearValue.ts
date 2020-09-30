import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article, { ArticleValues } from '../../../types/Article';
import CapexExpenseSetGroup from '../../../types/CAPEX/CapexExpenseSetGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { CapexesAction } from './fetchCAPEX';

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
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation setCapexExpenseYearValue {
            setCapexExpenseYearValue(
              capexExpenseGroupId: ${group?.id?.toString()}
              capexExpenseId: ${capex.id}
              year: ${value.year}
              value: ${value.value}
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

      if (response.status === 200 && responseData?.totalValueByYear.__typename !== 'Error') {
        dispatch(
          capexUpdateYearValueSuccess(capex as Article, group, value, groupTotalValueByYear),
        );
      } else {
        dispatch(capexUpdateYearValueError(body.message));
      }
    } catch (e) {
      dispatch(capexUpdateYearValueError(e));
    }
  };
};
