import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { query } from '@/api/graphql-request';
import { MACROPARAMETER_SET_LIST } from '@/api/macroparameters';
import MacroparameterSet from '@/types/Macroparameters/MacroparameterSet';

export const MACROPARAMS_SET_LIST_FETCH = 'MACROPARAMS_SET_LIST_FETCH';
export const MACROPARAMS_SET_LIST_SUCCESS = 'MACROPARAMS_SET_LIST_SUCCESS';
export const MACROPARAMS_SET_LIST_ERROR = 'MACROPARAMS_SET_LIST_ERROR';

export const MACROPARAMS_SET_SELECTED = 'MACROPARAMS_SET_SELECTED';

export interface MacroparamsAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const macroparameterSetListFetch = (): MacroparamsAction => ({
  type: MACROPARAMS_SET_LIST_FETCH,
});

const macroparameterSetListSuccess = (
  macroparameterSetList: MacroparameterSet[],
): MacroparamsAction => ({
  type: MACROPARAMS_SET_LIST_SUCCESS,
  payload: macroparameterSetList,
});

const macroparameterSetListError = (message: any): MacroparamsAction => ({
  type: MACROPARAMS_SET_LIST_ERROR,
  errorMessage: message,
});

export function fetchMacroparameterSetList(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(macroparameterSetListFetch());
    query({
      query: MACROPARAMETER_SET_LIST,
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.macroparameterSetList;
        if (responseData && responseData.result?.__typename !== 'Error') {
          dispatch(macroparameterSetListSuccess(responseData));
        } else {
          dispatch(macroparameterSetListError('Error'));
        }
      })
      .catch((e) => {
        dispatch(macroparameterSetListError(e));
      });
  };
}

export const selectMacroparameterSet = (MacroparamSet: MacroparameterSet): MacroparamsAction => ({
  type: MACROPARAMS_SET_SELECTED,
  payload: MacroparamSet,
});
