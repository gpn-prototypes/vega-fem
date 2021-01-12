import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { query } from '@/api/graphql-request';
import { FETCH_OPEX_SET } from '@/api/opex';
import OPEXSetType from '@/types/OPEX/OPEXSetType';

export const OPEX_SET_FETCH = 'OPEX_SET_FETCH';
export const OPEX_SET_SUCCESS = 'OPEX_SET_SUCCESS';
export const OPEX_SET_ERROR = 'OPEX_SET_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXSetFetchInit = (): OPEXAction => ({
  type: OPEX_SET_FETCH,
});

const OPEXSetSuccess = (OPEXSetInstance: OPEXSetType): OPEXAction => ({
  type: OPEX_SET_SUCCESS,
  payload: OPEXSetInstance,
});

const OPEXSetError = (message: any): OPEXAction => ({
  type: OPEX_SET_ERROR,
  errorMessage: message,
});

export function fetchOPEXSet(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXSetFetchInit());

    query({
      query: FETCH_OPEX_SET,
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.opex;

        if (responseData && responseData.__typename !== 'Error') {
          dispatch(OPEXSetSuccess(responseData));
        } else if (responseData?.__typename === 'Error') {
          dispatch(OPEXSetError(responseData));
        }
      })
      .catch((e) => {
        dispatch(OPEXSetError(e));
      });
  };
}
