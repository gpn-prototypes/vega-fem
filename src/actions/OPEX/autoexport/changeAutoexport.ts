import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { CHANGE_AUTOEXPORT } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

export const OPEX_AUTOEXPORT_CHANGE_INIT = 'OPEX_AUTOEXPORT_CHANGE_INIT';
export const OPEX_AUTOEXPORT_CHANGE_SUCCESS = 'OPEX_AUTOEXPORT_CHANGE_SUCCESS';
export const OPEX_AUTOEXPORT_CHANGE_ERROR = 'OPEX_AUTOEXPORT_CHANGE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAutoexportChangeInit = (): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_INIT,
});

const OPEXAutoexportChangeSuccess = (autoexport: OPEXGroup): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_SUCCESS,
  payload: autoexport,
});

const OPEXAutoexportChangeError = (message: any): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_ERROR,
  errorMessage: message,
});

export function autoexportChange(
  autoexport: OPEXGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAutoexportChangeInit());

    mutate({
      query: CHANGE_AUTOEXPORT,
      variables: {
        yearEnd: autoexport.yearEnd,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.changeOpexAutoexport;

        if (responseData && responseData.autoexport?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXAutoexportChangeSuccess(responseData.autoexport));
        } else if (responseData?.autoexport?.__typename === 'Error') {
          dispatch(OPEXAutoexportChangeError(responseData?.autoexport));
        }
      })
      .catch((e) => {
        dispatch(OPEXAutoexportChangeError(e));
      });
  };
}
