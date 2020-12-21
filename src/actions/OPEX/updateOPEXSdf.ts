import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '../../helpers/currentVersionFromSessionStorage';
import headers from '../../helpers/headers';

import { OPEXAction } from './fetchOPEXSet';

import { graphqlRequestUrl } from '@/helpers/graphqlRequestUrl';
import { serviceConfig } from '@/helpers/sevice-config';

export const OPEX_SET_SDF_INIT = 'OPEX_SET_CHANGE_INIT';
export const OPEX_SET_SDF_SUCCESS = 'OPEX_SET_SDF_SUCCESS';
export const OPEX_SET_SDF_ERROR = 'OPEX_SET_SDF_ERROR';

const OPEXSetChangeSdfInit = (): OPEXAction => ({
  type: OPEX_SET_SDF_INIT,
});

const OPEXSetChangeSdfSuccess = (sdfFlag: boolean): OPEXAction => ({
  type: OPEX_SET_SDF_SUCCESS,
  payload: sdfFlag,
});

const OPEXSetChangeSdfError = (message: any): OPEXAction => ({
  type: OPEX_SET_SDF_ERROR,
  errorMessage: message,
});

export function changeOPEXSdf(sdfFlag: boolean): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXSetChangeSdfInit());

    try {
      const response = await fetch(`${graphqlRequestUrl}/${serviceConfig.projectId}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation setOpexSdf($sdf: Boolean) {
            setOpexSdf(
              sdf: $sdf,
              version:${currentVersionFromSessionStorage()}
            ) {
              opexSdf {
                __typename
                ... on OpexSdf {
                  sdf
                }
                ... on Error {
                  code
                  message
                  details
                  payload
                }
              }
            }
          }`,
          variables: {
            sdf: sdfFlag,
          },
        }),
      });
      const body = await response.json();

      if (response.status === 200) {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(OPEXSetChangeSdfSuccess(sdfFlag));
      } else {
        dispatch(OPEXSetChangeSdfError(body.message));
      }
    } catch (e) {
      dispatch(OPEXSetChangeSdfError(e));
    }
  };
}
