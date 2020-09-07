import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { OPEXGroup } from '../../../types/OPEX/OPEXGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

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

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation {removeOpexAutoexport{ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(OPEXAutoexportRemoveSuccess(autoexport));
      } else {
        dispatch(OPEXAutoexportRemoveError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAutoexportRemoveError(e));
    }
  };
}
