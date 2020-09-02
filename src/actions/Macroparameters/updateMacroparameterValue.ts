import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article from '../../../types/Article';
import MacroparameterSetGroup from '../../../types/Macroparameters/MacroparameterSetGroup';
import headers from '../../helpers/headers';
import { projectIdFromLocalStorage } from '../../helpers/projectIdToLocalstorage';

import { MacroparamsAction } from './macroparameterSetList';

export const MACROPARAM_UPDATE_VALUE_INIT = 'MACROPARAM_UPDATE_VALUE_INIT';
export const MACROPARAM_UPDATE_VALUE_SUCCESS = 'MACROPARAM_UPDATE_VALUE_SUCCESS';
export const MACROPARAM_UPDATE_VALUE_ERROR = 'MACROPARAM_UPDATE_VALUE_ERROR';

const macroparameterUpdateValueInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_UPDATE_VALUE_INIT,
});

const macroparameterUpdateValueSuccess = (
  macroparameter: Article,
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
  macroparameter: Article,
  group: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterUpdateValueInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            `mutation {changeMacroparameter(` +
            `macroparameterSetId: ${selected.id.toString()},` +
            `macroparameterGroupId: ${group?.id?.toString()},` +
            `macroparameterId: ${macroparameter.id},` +
            `${macroparameter.caption ? `caption:"${macroparameter.caption}",` : ''}` +
            `${macroparameter.unit ? `unit:"${macroparameter.unit}",` : ''}` +
            `${macroparameter.value ? `value:${macroparameter.value},` : ''}` +
            `){macroparameter{name, id, caption,unit, value{year,value}}, ok}}`,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.changeMacroparameter;

      if (response.ok && responseData?.ok) {
        const updatedMacroparameter = responseData?.macroparameter;

        if (updatedMacroparameter) {
          dispatch(macroparameterUpdateValueSuccess(updatedMacroparameter as Article, group));
        }
      } else {
        dispatch(macroparameterUpdateValueError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterUpdateValueError(e));
    }
  };
};
