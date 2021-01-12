import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { CapexesAction } from '../fetchCAPEX';

import { CHANGE_CAPEX_EXPENSE } from '@/api/capex';
import { mutate } from '@/api/graphql-request';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article, { ArticleValues } from '@/types/Article';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';

export const CHANGE_CAPEX_EXPENSE_INIT = 'CHANGE_CAPEX_EXPENSE_INIT';
export const CHANGE_CAPEX_EXPENSE_SUCCESS = 'CHANGE_CAPEX_EXPENSE_SUCCESS';
export const CHANGE_CAPEX_EXPENSE_ERROR = 'CHANGE_CAPEX_EXPENSE_ERROR';

const changeCapexExpenseInitialized = (): CapexesAction => ({
  type: CHANGE_CAPEX_EXPENSE_INIT,
});

const changeCapexExpenseSuccess = (
  capex: Article,
  group: CapexExpenseSetGroup,
  groupTotalValueByYear: ArticleValues[],
): CapexesAction => ({
  type: CHANGE_CAPEX_EXPENSE_SUCCESS,
  payload: { capex, group, groupTotalValueByYear },
});

const changeCapexExpenseError = (message: any): CapexesAction => ({
  type: CHANGE_CAPEX_EXPENSE_ERROR,
  errorMessage: message,
});

export const requestChangeCapexExpense = (
  capex: Article,
  group: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(changeCapexExpenseInitialized());

    mutate({
      query: CHANGE_CAPEX_EXPENSE,
      variables: {
        capexExpenseGroupId: `${group?.id}`,
        capexExpenseId: `${capex.id}`,
        caption: capex.caption,
        name: capex.name,
        unit: capex.unit,
        value: capex.value,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.changeCapexExpense;
        const groupTotalValueByYear = responseData?.totalValueByYear;

        if (responseData && responseData?.capexExpense?.__typename !== 'Error') {
          const newCapex = responseData.capexExpense;

          if (newCapex) {
            dispatch(changeCapexExpenseSuccess(newCapex as Article, group, groupTotalValueByYear));
            sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          }
        } else if (responseData?.capexExpense?.__typename === 'Error') {
          dispatch(changeCapexExpenseError(responseData?.capexExpense));
        }
      })
      .catch((e) => {
        dispatch(changeCapexExpenseError(e));
      });
  };
};
