import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from './macroparameterSetList';

import { mutate } from '@/api/graphql-request';
import { CHANGE_MACROPARAMETER_SET_GROUP } from '@/api/macroparameters';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const MACROPARAM_SET_GROUP_CHANGE_INIT = 'MACROPARAM_SET_GROUP_CHANGE_INIT';
export const MACROPARAM_SET_GROUP_CHANGE_SUCCESS = 'MACROPARAM_SET_GROUP_CHANGE_SUCCESS';
export const MACROPARAM_SET_GROUP_CHANGE_ERROR = 'MACROPARAM_SET_GROUP_CHANGE_ERROR';

const macroparameterSetGroupChangeInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_CHANGE_INIT,
});

const macroparameterSetGroupChangeSuccess = (
  macroparameterSet: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_CHANGE_SUCCESS,
  payload: macroparameterSet,
});

const macroparameterSetGroupChangeError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_CHANGE_ERROR,
  errorMessage: message,
});

export const changeMacroparameterSetGroup = (
  newMacroparameterSetGroup: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterSetGroupChangeInitialized());

    mutate({
      query: CHANGE_MACROPARAMETER_SET_GROUP,
      variables: {
        macroparameterSetId: selected?.toString(),
        macroparameterGroupId: newMacroparameterSetGroup?.id?.toString(),
        caption: newMacroparameterSetGroup.caption,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.changeMacroparameterGroup;

        if (responseData && responseData?.macroparameterGroup?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          const newGroup = responseData?.macroparameterGroup;

          if (newGroup) {
            dispatch(
              macroparameterSetGroupChangeSuccess({ ...newGroup } as MacroparameterSetGroup),
            );
          }
        } else if (responseData?.macroparameterGroup?.__typename === 'Error') {
          dispatch(macroparameterSetGroupChangeError(responseData?.macroparameterGroup));
        }
      })
      .catch((e) => {
        dispatch(macroparameterSetGroupChangeError(e));
      });
  };
};
