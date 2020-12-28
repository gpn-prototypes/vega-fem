import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from './macroparameterSetList';

import { mutate } from '@/api/graphql-request';
import { DELETE_MACROPARAMETER_SET_GROUP } from '@/api/macroparameters';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const MACROPARAM_SET_GROUP_DELETE_INIT = 'MACROPARAM_SET_GROUP_DELETE_INIT';
export const MACROPARAM_SET_GROUP_DELETE_SUCCESS = 'MACROPARAM_SET_GROUP_DELETE_SUCCESS';
export const MACROPARAM_SET_GROUP_DELETE_ERROR = 'MACROPARAM_SET_GROUP_DELETE_ERROR';

const macroparameterSetGroupDeleteInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_DELETE_INIT,
});

const macroparameterSetGroupDeleteSuccess = (
  macroparameterSet: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_DELETE_SUCCESS,
  payload: macroparameterSet,
});

const macroparameterSetGroupDeleteError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_DELETE_ERROR,
  errorMessage: message,
});

export const deleteMacroparameterSetGroup = (
  macroparameterSetGroup: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterSetGroupDeleteInitialized());

    mutate({
      query: DELETE_MACROPARAMETER_SET_GROUP,
      variables: {
        macroparameterSetId: selected?.id?.toString(),
        macroparameterGroupId: macroparameterSetGroup?.id?.toString(),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.deleteCapexExpenseGroup;
        if (responseData && responseData.result?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(macroparameterSetGroupDeleteSuccess(macroparameterSetGroup));
        } else {
          dispatch(macroparameterSetGroupDeleteError('Error'));
        }
      })
      .catch((e) => {
        dispatch(macroparameterSetGroupDeleteError(e));
      });
  };
};
