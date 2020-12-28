import { NetworkStatus } from '@apollo/client';
import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { FETCH_CAPEX } from '@/api/capex';
import { query } from '@/api/graphql-request';
import CapexSet from '@/types/CAPEX/CapexSet';

export const CAPEX_FETCH = 'CAPEX_FETCH';
export const CAPEX_SUCCESS = 'CAPEX_SUCCESS';
export const CAPEX_ERROR = 'CAPEX_ERROR';

export interface CapexesAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const capexFetch = (): CapexesAction => ({
  type: CAPEX_FETCH,
});

const capexSuccess = (capex: CapexSet): CapexesAction => ({
  type: CAPEX_SUCCESS,
  payload: capex,
});

const capexError = (message: any): CapexesAction => ({
  type: CAPEX_ERROR,
  errorMessage: message,
});

export function fetchCapex(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexFetch());
    query({
      query: FETCH_CAPEX,
      appendProjectId: true,
    })
      ?.then((response) => {
        if (response?.networkStatus === NetworkStatus.ready && response.data?.capex) {
          dispatch(capexSuccess(response.data?.capex));
        } else if (!response?.loading) {
          dispatch(capexError('Error'));
        }
      })
      .catch((e) => {
        dispatch(capexError(e));
      });
  };
}
