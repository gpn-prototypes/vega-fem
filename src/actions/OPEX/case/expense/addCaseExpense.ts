import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
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

    try {
      const response = await fetch(`${graphqlRequestUrl}/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation createOpexCaseExpense {
            project(version: ${currentVersionFromSessionStorage()}) {
              __typename
              ... on Error {
                code,
                message
              }
              ... on ProjectMutation {
                createOpexCaseExpense(
                  caseId:${caseGroup.id},
                  caption:"${article.caption?.toString()}",
                  unit:"${article.unit?.toString()}"
                ) {
                  opexExpense {
                    __typename
                    ... on OpexExpense {
                      id
                      name
                      caption
                      unit
                      valueTotal
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
              }
            }
          }`,
        }),
      });
      const body = await response.json();

      if (
        response.status === 200 &&
        body.data?.project?.createOpexCaseExpense?.opexExpense?.__typename !== 'Error'
      ) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(
          OPEXAddCaseExpenseSuccess(
            caseGroup,
            body.data?.project?.createOpexCaseExpense?.opexExpense,
          ),
        );
      } else {
        dispatch(OPEXAddCaseExpenseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAddCaseExpenseError(e));
    }
  };
}
