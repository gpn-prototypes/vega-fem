import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {OPEXGroup} from '../../../types/OPEX/OPEXGroup';

import OPEXSetType from '../../../types/OPEX/OPEXSetType';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

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

export function createCase(
  autoexport: OPEXGroup
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXCreateCaseInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {createOpexCase(` +
            `caption: "${autoexport.yearEnd.toString()}",` +
            `yearStart: ${autoexport.yearStart.toString()},` +
            `yearEnd: ${autoexport.yearEnd.toString()},` +
            `){opexCase{name,caption,yearStart,yearEnd}, ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(OPEXCreateCaseSuccess(body.data?.opex));
      } else {
        dispatch(OPEXCreateCaseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXCreateCaseError(e));
    }
  };
}
