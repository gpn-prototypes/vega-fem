import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import MacroparameterSetGroup from '../../../types/Macroparameters/MacroparameterSetGroup';
import { authHeader } from '../../helpers/authTokenToLocalstorage';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { MacroparamsAction } from './macroparameterSetList';

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

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify({
          query:
            `mutation {createMacroparameterGroup(macroparameterSetId:${selected.id.toString()},` +
            `caption: "${newMacroparameterSetGroup.caption}", ` +
            `name: "${newMacroparameterSetGroup.name}"` +
            `){macroparameterGroup{name, id, caption}, ok}}`,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.createMacroparameterGroup;

      if (response.ok && responseData?.ok) {
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
        dispatch(macroparameterSetGroupAddError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterSetGroupAddError(e));
    }
  };
};
