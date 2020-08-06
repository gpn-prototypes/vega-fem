import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {OPEXGroup} from '../../../types/OPEX/OPEXGroup';

import OPEXSetType from '../../../types/OPEX/OPEXSetType';
import { authHeader } from '../../helpers/authTokenToLocalstorage';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

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

const OPEXAutoexportChangeSuccess = (OPEXSetInstance: OPEXSetType): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_SUCCESS,
  payload: OPEXSetInstance,
});

const OPEXAutoexportChangeError = (message: any): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_ERROR,
  errorMessage: message,
});

export function autoexportChange(
  autoexport: OPEXGroup
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAutoexportChangeInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify({
          query:
            `mutation {changeOpexAutoexport(` +
            `yearEnd: ${autoexport.yearEnd.toString()},` +
            `){autoexport{yearStart,yearEnd}, ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(OPEXAutoexportChangeSuccess(body.data?.opex));
      } else {
        dispatch(OPEXAutoexportChangeError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAutoexportChangeError(e));
    }
  };
}
