import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { query } from '@/api/graphql-request';
import { CHANGE_OPEX_SET } from '@/api/opex';
import OPEXSetType from '@/types/OPEX/OPEXSetType';

export const OPEX_SET_CHANGE_INIT = 'OPEX_SET_CHANGE_INIT';
export const OPEX_SET_CHANGE_SUCCESS = 'OPEX_SET_CHANGE_SUCCESS';
export const OPEX_SET_CHANGE_ERROR = 'OPEX_SET_CHANGE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXSetChangeInit = (): OPEXAction => ({
  type: OPEX_SET_CHANGE_INIT,
});

const OPEXSetChangeSuccess = (OPEXSetInstance: OPEXSetType): OPEXAction => ({
  type: OPEX_SET_CHANGE_SUCCESS,
  payload: OPEXSetInstance,
});

const OPEXSetChangeError = (message: any): OPEXAction => ({
  type: OPEX_SET_CHANGE_ERROR,
  errorMessage: message,
});

export function changeOPEXSet(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  // TODO: что это за запрос? Его надо менять?
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXSetChangeInit());

    query({
      query: CHANGE_OPEX_SET,
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.opex;

        if (responseData && responseData?.__typename !== 'Error') {
          dispatch(OPEXSetChangeSuccess(responseData));
        } else if (responseData?.__typename === 'Error') {
          dispatch(OPEXSetChangeError(responseData));
        }
      })
      .catch((e) => {
        dispatch(OPEXSetChangeError(e));
      });
  };
}
