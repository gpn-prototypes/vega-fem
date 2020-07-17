import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import MacroparameterSet from '../../types/MacroparameterSet';
import MacroparameterSetGroup from '../../types/MacroparameterSetGroup';
import {authHeader} from '../helpers/authTokenToLocalstorage';

import { MacroparamsAction } from './macroparameterSetList';

export const MACROPARAM_SET_GROUP_ADD_INIT = 'MACROPARAM_SET_GROUP_ADD_INIT';
export const MACROPARAM_SET_GROUP_ADD_SUCCESS = 'MACROPARAM_SET_GROUP_ADD_SUCCESS';
export const MACROPARAM_SET_GROUP_ADD_ERROR = 'MACROPARAM_SET_GROUP_ADD_ERROR';

const macroparameterSetGroupAddInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_SET_GROUP_ADD_INIT,
});

const macroparameterSetGroupAddSuccess = (
  macroparameterSet: MacroparameterSet,
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
      const response = await fetch('graphql/5edde72c45eb7b93ad30c0c3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader()
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
      const createdMacroparameterGroup = body?.data?.createMacroparameterGroup;

      if (response.ok && createdMacroparameterGroup?.ok) {

        const newGroup = createdMacroparameterGroup?.macroparameterGroup;

        if (newGroup)
        dispatch(
          macroparameterSetGroupAddSuccess({...newGroup, ...{macroparameterList: []}} as MacroparameterSetGroup),
        );
      } else {
        dispatch(macroparameterSetGroupAddError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterSetGroupAddError(e));
    }
  };
};
