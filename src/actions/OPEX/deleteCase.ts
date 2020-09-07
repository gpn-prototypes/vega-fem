import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { OPEXGroup } from '../../../types/OPEX/OPEXGroup';
import OPEXSetType from '../../../types/OPEX/OPEXSetType';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

export const OPEX_DELETE_CASE_INIT = 'OPEX_DELETE_CASE_INIT';
export const OPEX_DELETE_CASE_SUCCESS = 'OPEX_DELETE_CASE_SUCCESS';
export const OPEX_DELETE_CASE_ERROR = 'OPEX_DELETE_CASE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXDeleteCaseInit = (): OPEXAction => ({
  type: OPEX_DELETE_CASE_INIT,
});

const OPEXDeleteCaseSuccess = (OPEXSetInstance: OPEXSetType): OPEXAction => ({
  type: OPEX_DELETE_CASE_SUCCESS,
  payload: OPEXSetInstance,
});

const OPEXDeleteCaseError = (message: any): OPEXAction => ({
  type: OPEX_DELETE_CASE_ERROR,
  errorMessage: message,
});

export function deleteCase(opexCase: OPEXGroup): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXDeleteCaseInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation {deleteOpexCase(caseId:"${opexCase.id}"){ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(OPEXDeleteCaseSuccess(body.data?.changeOpexCase?.opexCase));
      } else {
        dispatch(OPEXDeleteCaseError(body.message));
      }
    } catch (e) {
      dispatch(OPEXDeleteCaseError(e));
    }
  };
}
