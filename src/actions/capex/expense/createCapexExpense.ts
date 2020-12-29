import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { CapexesAction } from '../fetchCAPEX';

import { CREATE_CAPEX_EXPENSE } from '@/api/capex';
import { mutate } from '@/api/graphql-request';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';

export const CREATE_CAPEX_EXPENSE_INIT = 'CREATE_CAPEX_EXPENSE_INIT';
export const CREATE_CAPEX_EXPENSE_SUCCESS = 'CREATE_CAPEX_EXPENSE_SUCCESS';
export const CREATE_CAPEX_EXPENSE_ERROR = 'CREATE_CAPEX_EXPENSE_ERROR';

const createCapexExpenseInitialized = (): CapexesAction => ({
  type: CREATE_CAPEX_EXPENSE_INIT,
});

const createCapexExpenseSuccess = (capex: Article, group: CapexExpenseSetGroup): CapexesAction => ({
  type: CREATE_CAPEX_EXPENSE_SUCCESS,
  payload: { capex, group },
});

const createCapexExpenseError = (message: any): CapexesAction => ({
  type: CREATE_CAPEX_EXPENSE_ERROR,
  errorMessage: message,
});

export const requestCreateCapexExpense = (
  newCapexExpense: Article,
  group: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(createCapexExpenseInitialized());

    mutate({
      query: CREATE_CAPEX_EXPENSE,
      variables: {
        capexExpenseGroupId: group?.id?.toString(),
        caption: newCapexExpense.caption,
        unit: newCapexExpense.unit,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.createCapexExpense;

        if (responseData && responseData.capexExpense?.__typename !== 'Error') {
          const capex = responseData?.capexExpense;

          if (capex) {
            sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
            dispatch(createCapexExpenseSuccess(capex as Article, group));
          }
        } else {
          dispatch(createCapexExpenseError('Error'));
        }
      })
      .catch((e) => {
        dispatch(createCapexExpenseError(e));
      });
  };
};
