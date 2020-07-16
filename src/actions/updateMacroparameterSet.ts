import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import MacroparameterSet from '../../types/MacroparameterSet';

import { MacroparamsAction } from './macroparameterSetList';

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

    try {
      const response = await fetch('graphql/5edde72c45eb7b93ad30c0c3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query:
            `'mutation {changeMacroparameterSet(macroparameterSetId:'}${selected.id.toString()},` +
            `category:${newMacroparameterSet.category},` +
            `caption: "${newMacroparameterSet.caption}" ,` +
            `name: "${newMacroparameterSet.name}" ,` +
            `years:${newMacroparameterSet.years}){ok}}`,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(
          macroparameterSetUpdateSuccess({
            ...selected,
            ...newMacroparameterSet,
          } as MacroparameterSet),
        );
      } else {
        dispatch(macroparameterSetUpdateError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterSetUpdateError(e));
    }
  };
};
