import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { currentVersionFromSessionStorage } from '../../helpers/currentVersionFromSessionStorage';

import { OPEXAction } from './fetchOPEXSet';

import { mutate } from '@/api/graphql-request';
import { UPDATE_OPEX_SDF } from '@/api/opex';

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

    mutate({
      query: UPDATE_OPEX_SDF,
      variables: {
        sdf: sdfFlag,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.setOpexSdf;
        if (responseData && responseData?.opexSdf?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXSetChangeSdfSuccess(sdfFlag));
        } else {
          dispatch(OPEXSetChangeSdfError('Error'));
        }
      })
      .catch((e) => {
        dispatch(OPEXSetChangeSdfError(e));
      });
  };
}
