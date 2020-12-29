import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { ADD_OPEX_CASE_EXPENSE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

export const OPEX_ADD_CASE_EXPENSE_INIT = 'OPEX_ADD_CASE_EXPENSE_INIT';
export const OPEX_ADD_CASE_EXPENSE_SUCCESS = 'OPEX_ADD_CASE_EXPENSE_SUCCESS';
export const OPEX_ADD_CASE_EXPENSE_ERROR = 'OPEX_ADD_CASE_EXPENSE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAddCaseExpenseInit = (): OPEXAction => ({
  type: OPEX_ADD_CASE_EXPENSE_INIT,
});

const OPEXAddCaseExpenseSuccess = (caseGroup: OPEXGroup, expense: Article): OPEXAction => ({
  type: OPEX_ADD_CASE_EXPENSE_SUCCESS,
  payload: { caseGroup, expense },
});

const OPEXAddCaseExpenseError = (message: any): OPEXAction => ({
  type: OPEX_ADD_CASE_EXPENSE_ERROR,
  errorMessage: message,
});

export function addCaseExpense(
  article: Article,
  caseGroup: OPEXGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAddCaseExpenseInit());

    mutate({
      query: ADD_OPEX_CASE_EXPENSE,
      variables: {
        caseId: caseGroup.id,
        caption: article.caption?.toString(),
        unit: article.unit?.toString(),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.createOpexCaseExpense;
        if (responseData && responseData.opexExpense?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXAddCaseExpenseSuccess(caseGroup, responseData.opexExpense));
        } else {
          dispatch(OPEXAddCaseExpenseError('Error'));
        }
      })
      .catch((e) => {
        dispatch(OPEXAddCaseExpenseError(e));
      });
  };
}
