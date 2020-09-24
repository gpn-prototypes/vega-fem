import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import MacroparameterSetGroup from '../../../types/Macroparameters/MacroparameterSetGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { MacroparamsAction } from './macroparameterSetList';

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

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {` +
            `deleteMacroparameterGroup(` +
            `macroparameterSetId:"${selected.id.toString()}"` +
            `macroparameterGroupId:"${macroparameterSetGroup.id}"){ok}` +
            `}`,
        }),
      });

      const body = await response.json();

      if (response.ok) {
        dispatch(macroparameterSetGroupDeleteSuccess(macroparameterSetGroup));
      } else {
        dispatch(macroparameterSetGroupDeleteError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterSetGroupDeleteError(e));
    }
  };
};
