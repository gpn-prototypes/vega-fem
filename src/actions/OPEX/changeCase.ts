import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { OPEXGroup } from '../../../types/OPEX/OPEXGroup';
import OPEXSetType from '../../../types/OPEX/OPEXSetType';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

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

const OPEXChangeCaseSuccess = (OPEXSetInstance: OPEXSetType): OPEXAction => ({
  type: OPEX_CHANGE_CASE_SUCCESS,
  payload: OPEXSetInstance,
});

const OPEXChangeCaseError = (message: any): OPEXAction => ({
  type: OPEX_CHANGE_CASE_ERROR,
  errorMessage: message,
});

export function changeCase(opexCase: OPEXGroup): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXChangeCaseInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {` +
            `changeOpexCase(` +
            `caseId:"${opexCase.id}",` +
            `caption:"${opexCase.caption}",` +
            `yearStart:${opexCase.yearStart.toString()},` +
            `yearEnd:${opexCase.yearEnd.toString()}` +
            `){opexCase{name,caption,yearStart,yearEnd} ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(OPEXChangeCaseSuccess(body.data?.changeOpexCase?.opexCase));
      } else {
        dispatch(OPEXChangeCaseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXChangeCaseError(e));
    }
  };
}
