import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from './macroparameterSetList';

import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import headers from '@/helpers/headers';
import { projectIdFromLocalStorage } from '@/helpers/projectIdToLocalstorage';
import Macroparameter, { ArticleValues } from '@/types/Article';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const MACROPARAM_UPDATE_YEAR_VALUE_INIT = 'MACROPARAM_UPDATE_YEAR_VALUE_INIT';
export const MACROPARAM_UPDATE_YEAR_VALUE_SUCCESS = 'MACROPARAM_UPDATE_YEAR_VALUE_SUCCESS';
export const MACROPARAM_UPDATE_YEAR_VALUE_ERROR = 'MACROPARAM_UPDATE_YEAR_VALUE_ERROR';

const macroparameterUpdateYearValueInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_UPDATE_YEAR_VALUE_INIT,
});

const macroparameterUpdateYearValueSuccess = (
  macroparameter: Macroparameter,
  group: MacroparameterSetGroup,
  value: ArticleValues,
): MacroparamsAction => ({
  type: MACROPARAM_UPDATE_YEAR_VALUE_SUCCESS,
  payload: { macroparameter, group, value },
});

const macroparameterUpdateYearValueError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_UPDATE_YEAR_VALUE_ERROR,
  errorMessage: message,
});

export const requestUpdateMacroparameterYearValue = (
  macroparameter: Macroparameter,
  group: MacroparameterSetGroup,
  value: ArticleValues,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterUpdateYearValueInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation setMacroparameterYearValue{
              setMacroparameterYearValue(
                macroparameterSetId: ${selected.id.toString()}
                macroparameterGroupId: ${group?.id?.toString()}
                macroparameterId: ${macroparameter.id}
                year: ${value.year}
                value: ${value.value}
                version:${currentVersionFromSessionStorage()}
              ){
                 macroparameter{
                    __typename
                    ... on Error{
                      code
                      message
                      details
                      payload
                    }
                }
              }
            }`,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.setMacroparameterYearValue;

      if (response.status === 200 && responseData?.macroparameter?.__typename !== 'Error') {
        sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
        dispatch(macroparameterUpdateYearValueSuccess(macroparameter, group, value));
      } else {
        dispatch(macroparameterUpdateYearValueError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterUpdateYearValueError(e));
    }
  };
};
