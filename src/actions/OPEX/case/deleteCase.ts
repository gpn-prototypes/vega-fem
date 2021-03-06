import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';
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
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation deleteOpexCase{
            deleteOpexCase(
            caseId:"${opexCase.id}",
            version:${currentVersionFromSessionStorage()}
            ){
              result{
                __typename
                ... on Result{
                  vid
                }
                ... on Error{
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
      const responseData = body?.data?.deleteOpexCase;

      if (response.status === 200 && responseData?.result?.__typename !== 'Error') {
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
