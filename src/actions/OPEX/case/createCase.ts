import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import headers from '@/helpers/headers';
import { serviceConfig } from '@/helpers/sevice-config';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';
import OPEXSetType from '@/types/OPEX/OPEXSetType';

export const OPEX_CREATE_CASE_INIT = 'OPEX_CREATE_CASE_INIT';
export const OPEX_CREATE_CASE_SUCCESS = 'OPEX_CREATE_CASE_SUCCESS';
export const OPEX_CREATE_CASE_ERROR = 'OPEX_CREATE_CASE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXCreateCaseInit = (): OPEXAction => ({
  type: OPEX_CREATE_CASE_INIT,
});

const OPEXCreateCaseSuccess = (OPEXSetInstance: OPEXSetType): OPEXAction => ({
  type: OPEX_CREATE_CASE_SUCCESS,
  payload: OPEXSetInstance,
});

const OPEXCreateCaseError = (message: any): OPEXAction => ({
  type: OPEX_CREATE_CASE_ERROR,
  errorMessage: message,
});

export function createCase(opexCase: OPEXGroup): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXCreateCaseInit());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation {
              createOpexCase(
                caption: "${opexCase.caption}",
                yearStart: ${opexCase.yearStart.toString()} ,
                yearEnd: ${opexCase.yearEnd.toString()},
                version:${currentVersionFromSessionStorage()}
              ){
                opexCase{
                __typename
                  ... on OpexExpenseGroup{
                    id
                    yearStart
                    yearEnd
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
      const responseData = body?.data?.createOpexCase;

      if (response.status === 200 && responseData?.opexCase?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(
          OPEXCreateCaseSuccess({
            ...responseData.opexCase,
            opexExpenseList: [],
          } as OPEXSetType),
        );
      } else {
        dispatch(OPEXCreateCaseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXCreateCaseError(e));
    }
  };
}
