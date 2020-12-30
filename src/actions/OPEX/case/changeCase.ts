import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';
import OPEXSetType from '@/types/OPEX/OPEXSetType';

export const OPEX_CHANGE_CASE_INIT = 'OPEX_CHANGE_CASE_INIT';
export const OPEX_CHANGE_CASE_SUCCESS = 'OPEX_CHANGE_CASE_SUCCESS';
export const OPEX_CHANGE_CASE_ERROR = 'OPEX_CHANGE_CASE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXChangeCaseInit = (): OPEXAction => ({
  type: OPEX_CHANGE_CASE_INIT,
});

const OPEXChangeCaseSuccess = (group: OPEXSetType): OPEXAction => ({
  type: OPEX_CHANGE_CASE_SUCCESS,
  payload: group,
});

const OPEXChangeCaseError = (message: any): OPEXAction => ({
  type: OPEX_CHANGE_CASE_ERROR,
  errorMessage: message,
});

export function changeCase(opexCase: OPEXGroup): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXChangeCaseInit());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation changeOpexCase{
              changeOpexCase(
                caseId:"${opexCase.id}",
                caption:"${opexCase.caption}",
                yearStart:${opexCase.yearStart.toString()},
                yearEnd:${opexCase.yearEnd.toString()},
                version:${currentVersionFromSessionStorage()}
              ){
                opexCase{
                  __typename
                  ... on OpexExpenseGroup{
                    yearStart
                    yearEnd
                    id
                    name
                    caption
                  }
                  ...on Error{
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
      const responseData = body?.data?.changeOpexCase;

      if (response.status === 200 && responseData?.opexCase?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXChangeCaseSuccess(responseData.opexCase));
      } else {
        dispatch(OPEXChangeCaseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXChangeCaseError(e));
    }
  };
}
