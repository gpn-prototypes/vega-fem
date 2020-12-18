import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

export const OPEX_DELETE_CASE_INIT = 'OPEX_DELETE_CASE_INIT';
export const OPEX_DELETE_CASE_SUCCESS = 'OPEX_DELETE_CASE_SUCCESS';
export const OPEX_DELETE_CASE_ERROR = 'OPEX_DELETE_CASE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXDeleteCaseInit = (): OPEXAction => ({
  type: OPEX_DELETE_CASE_INIT,
});

const OPEXDeleteCaseSuccess = (opexCase: OPEXGroup): OPEXAction => ({
  type: OPEX_DELETE_CASE_SUCCESS,
  payload: opexCase,
});

const OPEXDeleteCaseError = (message: any): OPEXAction => ({
  type: OPEX_DELETE_CASE_ERROR,
  errorMessage: message,
});

export function deleteCase(opexCase: OPEXGroup): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXDeleteCaseInit());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation deleteOpexCase {
            project(version: ${currentVersionFromSessionStorage()}) {
              __typename
              ... on Error {
                code,
                message
              }
              ... on ProjectMutation {
                deleteOpexCase(
                  caseId:"${opexCase.id}"
                ) {
                  result {
                    __typename
                    ... on Result {
                      vid
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
        body.data?.project?.deleteOpexCase?.result?.__typename !== 'Error'
      ) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXDeleteCaseSuccess(opexCase));
      } else {
        dispatch(OPEXDeleteCaseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXDeleteCaseError(e));
    }
  };
}
