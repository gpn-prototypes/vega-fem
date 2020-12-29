import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { CHANGE_OPEX_CASE_EXPENSE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

export const OPEX_CASE_CHANGE_EXPENSE_INIT = 'OPEX_CASE_CHANGE_EXPENSE_INIT';
export const OPEX_CASE_CHANGE_EXPENSE_SUCCESS = 'OPEX_CASE_CHANGE_EXPENSE_SUCCESS';
export const OPEX_CASE_CHANGE_EXPENSE_ERROR = 'OPEX_CASE_CHANGE_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXCaseChangeExpenseInit = (): OPEXAction => ({
  type: OPEX_CASE_CHANGE_EXPENSE_INIT,
});

const OPEXCaseChangeExpenseSuccess = (group: OPEXGroup, expense: Article): OPEXAction => ({
  type: OPEX_CASE_CHANGE_EXPENSE_SUCCESS,
  payload: { group, expense },
});

const OPEXCaseChangeExpenseError = (message: any): OPEXAction => ({
  type: OPEX_CASE_CHANGE_EXPENSE_ERROR,
  errorMessage: message,
});

export function caseChangeExpense(
  article: Article,
  group: OPEXGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXCaseChangeExpenseInit());

    mutate({
      query: CHANGE_OPEX_CASE_EXPENSE,
      variables: {
        caseId: group.id?.toString(),
        expenseId: article.id?.toString(),
        name: article.name?.toString(),
        caption: article.caption?.toString(),
        unit: article.unit?.toString(),
        value: article.value,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.changeOpexCaseExpense;
        if (responseData && responseData.opexExpense?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXCaseChangeExpenseSuccess(group, responseData.opexExpense));
        } else {
          dispatch(OPEXCaseChangeExpenseError('Error'));
        }
      })
      .catch((e) => {
        dispatch(OPEXCaseChangeExpenseError(e));
      });
  };
}
