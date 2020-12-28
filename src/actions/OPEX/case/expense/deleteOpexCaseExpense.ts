import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { DELETE_OPEX_CASE_EXPENSE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

export const OPEX_CASE_DELETE_EXPENSE_INIT = 'OPEX_CASE_DELETE_EXPENSE_INIT';
export const OPEX_CASE_DELETE_EXPENSE_SUCCESS = 'OPEX_CASE_DELETE_EXPENSE_SUCCESS';
export const OPEX_CASE_DELETE_EXPENSE_ERROR = 'OPEX_CASE_DELETE_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXCaseDeleteExpenseInit = (): OPEXAction => ({
  type: OPEX_CASE_DELETE_EXPENSE_INIT,
});

const OPEXCaseDeleteExpenseSuccess = (group: OPEXGroup, expense: Article): OPEXAction => ({
  type: OPEX_CASE_DELETE_EXPENSE_SUCCESS,
  payload: { group, expense },
});

const OPEXCaseDeleteExpenseError = (message: any): OPEXAction => ({
  type: OPEX_CASE_DELETE_EXPENSE_ERROR,
  errorMessage: message,
});

export function caseDeleteExpense(
  article: Article,
  group: OPEXGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXCaseDeleteExpenseInit());

    mutate({
      query: DELETE_OPEX_CASE_EXPENSE,
      variables: {
        caseId: group.id?.toString(),
        expenseId: article.id?.toString(),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.deleteOpexCaseExpense;
        if (responseData && responseData.result?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXCaseDeleteExpenseSuccess(group, article));
        } else {
          dispatch(OPEXCaseDeleteExpenseError('Error'));
        }
      })
      .catch((e) => {
        dispatch(OPEXCaseDeleteExpenseError(e));
      });
  };
}
