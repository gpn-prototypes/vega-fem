import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { DELETE_OPEX_CASE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

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

const OPEXDeleteCaseSuccess = (opexCase: OPEXGroup): OPEXAction => ({
  type: OPEX_DELETE_CASE_SUCCESS,
  payload: opexCase,
});

const OPEXDeleteCaseError = (message: any): OPEXAction => ({
  type: OPEX_DELETE_CASE_ERROR,
  errorMessage: message,
});

export function deleteCase(opexCase: OPEXGroup): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXDeleteCaseInit());

    mutate({
      query: DELETE_OPEX_CASE,
      variables: {
        caseId: opexCase.id,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.deleteOpexCase;

        if (responseData && responseData?.result?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXDeleteCaseSuccess(opexCase));
        } else {
          dispatch(OPEXDeleteCaseError('Error'));
        }
      })
      .catch((e) => {
        dispatch(OPEXDeleteCaseError(e));
      });
  };
}
