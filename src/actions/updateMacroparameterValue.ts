import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Macroparameter from '../../types/Macroparameter';
import MacroparameterSetGroup from '../../types/MacroparameterSetGroup';
import { authHeader } from '../helpers/authTokenToLocalstorage';

import { MacroparamsAction } from './macroparameterSetList';

export const MACROPARAM_UPDATE_VALUE_INIT = 'MACROPARAM_UPDATE_VALUE_INIT';
export const MACROPARAM_UPDATE_VALUE_SUCCESS = 'MACROPARAM_UPDATE_VALUE_SUCCESS';
export const MACROPARAM_UPDATE_VALUE_ERROR = 'MACROPARAM_UPDATE_VALUE_ERROR';

const macroparameterUpdateValueInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_UPDATE_VALUE_INIT,
});

const macroparameterUpdateValueSuccess = (
  macroparameter: Macroparameter,
  group: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: MACROPARAM_UPDATE_VALUE_SUCCESS,
  payload: { macroparameter, group },
});

const macroparameterUpdateValueError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_UPDATE_VALUE_ERROR,
  errorMessage: message,
});

export const requestUpdateMacroparameterValue = (
  macroparameter: Macroparameter,
  group: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterUpdateValueInitialized());

    try {
      /* TODO: set project id dynamically */
      const response = await fetch('graphql/5edde72c45eb7b93ad30c0c3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify({
          query:
            `mutation {changeMacroparameter(` +
            `macroparameterSetId: ${selected.id.toString()},` +
            `macroparameterGroupId: ${group?.id?.toString()},` +
            `macroparameterId: ${macroparameter.id},` +
            `value: ${macroparameter.value}` +
            `){macroparameter{name, id, caption, value{year,value}}, ok}}`,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.changeMacroparameter;

      if (response.ok && responseData?.ok) {
        const newMacroparameter = responseData?.macroparameter;

        if (newMacroparameter) {
          dispatch(macroparameterUpdateValueSuccess(newMacroparameter as Macroparameter, group));
        }
      } else {
        dispatch(macroparameterUpdateValueError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterUpdateValueError(e));
    }
  };
};
