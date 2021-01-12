import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { CapexesAction } from './fetchCAPEX';

import { UPDATE_CAPEX_YEAR_VALUE } from '@/api/capex/mutations';
import { mutate } from '@/api/graphql-request';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
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

    mutate({
      query: UPDATE_CAPEX_YEAR_VALUE,
      variables: {
        capexExpenseGroupId: group?.id?.toString(),
        capexExpenseId: capex.id,
        year: value.year,
        value: value.value,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.setCapexExpenseYearValue;
        const groupTotalValueByYear = responseData?.totalValueByYear;

        if (responseData && groupTotalValueByYear?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(
            capexUpdateYearValueSuccess(capex as Article, group, value, groupTotalValueByYear),
          );
        } else if (groupTotalValueByYear?.__typename === 'Error') {
          dispatch(capexUpdateYearValueError(groupTotalValueByYear));
        }
      })
      .catch((e) => {
        dispatch(capexUpdateYearValueError(e));
      });
  };
};
