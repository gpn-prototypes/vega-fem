import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from './macroparameterSetList';

import { mutate } from '@/api/graphql-request';
import { ADD_MACROPARAMETER_SET_GROUP } from '@/api/macroparameters';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const MACROPARAM_SET_GROUP_ADD_INIT = 'MACROPARAM_SET_GROUP_ADD_INIT';
export const MACROPARAM_SET_GROUP_ADD_SUCCESS = 'MACROPARAM_SET_GROUP_ADD_SUCCESS';
export const MACROPARAM_SET_GROUP_ADD_ERROR = 'MACROPARAM_SET_GROUP_ADD_ERROR';

const macroparameterSetGroupAddInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_ADD_INIT,
});

const macroparameterSetGroupAddSuccess = (
  macroparameterSet: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_ADD_SUCCESS,
  payload: macroparameterSet,
});

const macroparameterSetGroupAddError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_ADD_ERROR,
  errorMessage: message,
});

export const addMacroparameterSetGroup = (
  newMacroparameterSetGroup: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterSetGroupAddInitialized());

    mutate({
      query: ADD_MACROPARAMETER_SET_GROUP,
      variables: {
        macroparameterSetId: selected?.id?.toString(),
        caption: newMacroparameterSetGroup.caption,
        name: newMacroparameterSetGroup.name,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.createMacroparameterGroup;

        if (responseData && responseData.macroparameterGroup?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          const newGroup = responseData?.macroparameterGroup;

          if (newGroup) {
            dispatch(
              macroparameterSetGroupAddSuccess({
                ...newGroup,
                ...{ macroparameterList: [] },
              } as MacroparameterSetGroup),
            );
          }
        } else {
          dispatch(macroparameterSetGroupAddError('Error'));
        }
      })
      .catch((e) => {
        dispatch(macroparameterSetGroupAddError(e));
      });
  };
};
