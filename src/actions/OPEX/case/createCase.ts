import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { mutate } from '@/api/graphql-request';
import { CREATE_OPEX_CASE } from '@/api/opex';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';
import OPEXSetType from '@/types/OPEX/OPEXSetType';

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

export function createCase(opexCase: OPEXGroup): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXCreateCaseInit());

    mutate({
      query: CREATE_OPEX_CASE,
      variables: {
        caption: opexCase.caption,
        yearStart: opexCase.yearStart.toString(),
        yearEnd: opexCase.yearEnd.toString(),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.createOpexCase;

        if (responseData && responseData.opexCase?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(
            OPEXCreateCaseSuccess({
              ...responseData.opexCase,
              opexExpenseList: [],
            } as OPEXSetType),
          );
        } else if (responseData?.opexCase?.__typename === 'Error') {
          dispatch(OPEXCreateCaseError(responseData?.opexCase));
        }
      })
      .catch((e) => {
        dispatch(OPEXCreateCaseError(e));
      });
  };
}
