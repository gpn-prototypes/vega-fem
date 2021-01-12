import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { CHANGE_OPEX_CASE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';
import OPEXSetType from '@/types/OPEX/OPEXSetType';

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

const OPEXChangeCaseSuccess = (group: OPEXSetType): OPEXAction => ({
  type: OPEX_CHANGE_CASE_SUCCESS,
  payload: group,
});

const OPEXChangeCaseError = (message: any): OPEXAction => ({
  type: OPEX_CHANGE_CASE_ERROR,
  errorMessage: message,
});

export function changeCase(opexCase: OPEXGroup): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXChangeCaseInit());

    mutate({
      query: CHANGE_OPEX_CASE,
      variables: {
        caseId: opexCase.id,
        caption: opexCase.caption,
        yearStart: opexCase.yearStart.toString(),
        yearEnd: opexCase.yearEnd.toString(),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.changeOpexCase;

        if (responseData && responseData.opexCase?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(OPEXChangeCaseSuccess(responseData.opexCase));
        } else if (responseData?.opexCase?.__typename === 'Error') {
          dispatch(OPEXChangeCaseError(responseData?.opexCase));
        }
      })
      .catch((e) => {
        dispatch(OPEXChangeCaseError(e));
      });
  };
}
