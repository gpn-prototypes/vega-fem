import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Macroparameter from '../../types/Macroparameter';
import MacroparameterSetGroup from '../../types/MacroparameterSetGroup';
import { authHeader } from '../helpers/authTokenToLocalstorage';
import {projectIdFromLocalStorage} from '../helpers/projectIdToLocalstorage';

import { MacroparamsAction } from './macroparameterSetList';

export const MACROPARAM_ADD_INIT = 'MACROPARAM_ADD_INIT';
export const MACROPARAM_ADD_SUCCESS = 'MACROPARAM_ADD_SUCCESS';
export const MACROPARAM_ADD_ERROR = 'MACROPARAM_ADD_ERROR';

const macroparameterAddInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_ADD_INIT,
});

const macroparameterAddSuccess = (
  macroparameter: Macroparameter,
  group: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: MACROPARAM_ADD_SUCCESS,
  payload: { macroparameter, group },
});

const macroparameterAddError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_ADD_ERROR,
  errorMessage: message,
});

export const requestAddMacroparameter = (
  newMacroparameter: Macroparameter,
  group: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterAddInitialized());

    try {
      /* TODO: set project id dynamically */
      const response = await fetch('graphql/' + projectIdFromLocalStorage(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify({
          query:
            `mutation {createMacroparameter(` +
            `macroparameterSetId:${selected.id.toString()},` +
            `macroparameterGroupId:${group?.id?.toString()},` +
            `caption: "${newMacroparameter.caption}", ` +
            `unit: "${newMacroparameter.unit}"` +
            `){macroparameter{id, name, caption, unit, value{year,value}}, ok}}`,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.createMacroparameter;

      if (response.ok && responseData?.ok) {
        const macroparameter = responseData?.macroparameter;

        if (macroparameter) {
          dispatch(macroparameterAddSuccess(macroparameter as Macroparameter, group));
        }
      } else {
        dispatch(macroparameterAddError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterAddError(e));
    }
  };
};
