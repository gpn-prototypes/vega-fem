import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { REMOVE_AUTOEXPORT } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

export const OPEX_AUTOEXPORT_REMOVE_INIT = 'OPEX_AUTOEXPORT_REMOVE_INIT';
export const OPEX_AUTOEXPORT_REMOVE_SUCCESS = 'OPEX_AUTOEXPORT_REMOVE_SUCCESS';
export const OPEX_AUTOEXPORT_REMOVE_ERROR = 'OPEX_AUTOEXPORT_REMOVE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAutoexportRemoveInit = (): OPEXAction => ({
  type: OPEX_AUTOEXPORT_REMOVE_INIT,
});

const OPEXAutoexportRemoveSuccess = (autoexport: OPEXGroup): OPEXAction => ({
  type: OPEX_AUTOEXPORT_REMOVE_SUCCESS,
  payload: autoexport,
});

const OPEXAutoexportRemoveError = (message: any): OPEXAction => ({
  type: OPEX_AUTOEXPORT_REMOVE_ERROR,
  errorMessage: message,
});

export function autoexportRemove(
  autoexport: OPEXGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAutoexportRemoveInit());

    mutate({
      query: REMOVE_AUTOEXPORT,
      variables: {
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        if (!response?.data?.project?.removeOpexAutoexport) {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXAutoexportRemoveSuccess(autoexport));
        } else {
          dispatch(OPEXAutoexportRemoveError('Error'));
        }
      })
      .catch((e) => {
        dispatch(OPEXAutoexportRemoveError(e));
      });
  };
}
