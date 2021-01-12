import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from './macroparameterSetList';

import { mutate } from '@/api/graphql-request';
import { UPDATE_MACROPARAMETER_YEAR_VALUE } from '@/api/macroparameters';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
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

    mutate({
      query: UPDATE_MACROPARAMETER_YEAR_VALUE,
      variables: {
        macroparameterSetId: selected?.toString(),
        macroparameterGroupId: group?.id?.toString(),
        macroparameterId: macroparameter?.id?.toString(),
        year: value.year,
        value: value.value,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.setMacroparameterYearValue;

        if (responseData && responseData?.macroparameter?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(macroparameterUpdateYearValueSuccess(macroparameter, group, value));
        } else if (responseData?.macroparameter?.__typename === 'Error') {
          dispatch(macroparameterUpdateYearValueError(responseData?.macroparameter));
        }
      })
      .catch((e) => {
        dispatch(macroparameterUpdateYearValueError(e));
      });
  };
};
