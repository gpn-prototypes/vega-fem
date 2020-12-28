import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from './macroparameterSetList';

import { mutate } from '@/api/graphql-request';
import { CHANGE_MACROPARAMETER_SET } from '@/api/macroparameters';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import MacroparameterSet from '@/types/Macroparameters/MacroparameterSet';

export const MACROPARAM_SET_UPDATE_INIT = 'MACROPARAM_SET_UPDATE_INIT';
export const MACROPARAM_SET_UPDATE_SUCCESS = 'MACROPARAM_SET_UPDATE_SUCCESS';
export const MACROPARAM_SET_UPDATE_ERROR = 'MACROPARAM_SET_UPDATE_ERROR';

const macroparameterSetUpdateInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_SET_UPDATE_INIT,
  payload: {} as MacroparameterSet,
});

const macroparameterSetUpdateSuccess = (
  macroparameterSet: MacroparameterSet,
): MacroparamsAction => ({
  type: MACROPARAM_SET_UPDATE_SUCCESS,
  payload: macroparameterSet,
});

const macroparameterSetUpdateError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_SET_UPDATE_ERROR,
  payload: message,
});

export const updateMacroparameterSet = (
  newMacroparameterSet: MacroparameterSet,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterSetUpdateInitialized());

    mutate({
      query: CHANGE_MACROPARAMETER_SET,
      variables: {
        macroparameterSetId: selected?.id?.toString(),
        category: newMacroparameterSet.category,
        caption: newMacroparameterSet.caption,
        name: newMacroparameterSet.name,
        years: newMacroparameterSet.years,
        yearStart: newMacroparameterSet.yearStart,
        allProjects: newMacroparameterSet.allProjects,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.changeMacroparameterSet;

        if (responseData && responseData?.macroparameterSet?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(
            macroparameterSetUpdateSuccess(responseData?.macroparameterSet as MacroparameterSet),
          );
        } else {
          dispatch(macroparameterSetUpdateError('Error'));
        }
      })
      .catch((e) => {
        dispatch(macroparameterSetUpdateError(e));
      });
  };
};
