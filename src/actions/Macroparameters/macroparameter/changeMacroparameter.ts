import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from '../macroparameterSetList';

import { mutate } from '@/api/graphql-request';
import { CHANGE_MACROPARAMETER } from '@/api/macroparameters';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const CHANGE_MACROPARAM_INIT = 'CHANGE_MACROPARAM_INIT';
export const CHANGE_MACROPARAM_SUCCESS = 'CHANGE_MACROPARAM_SUCCESS';
export const CHANGE_MACROPARAM_ERROR = 'CHANGE_MACROPARAM_ERROR';

const changeMacroparameterInitialized = (): MacroparamsAction => ({
  type: CHANGE_MACROPARAM_INIT,
});

const changeMacroparameterSuccess = (
  macroparameter: Article,
  group: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: CHANGE_MACROPARAM_SUCCESS,
  payload: { macroparameter, group },
});

const changeMacroparameterError = (message: any): MacroparamsAction => ({
  type: CHANGE_MACROPARAM_ERROR,
  errorMessage: message,
});

export const requestChangeMacroparameter = (
  macroparameter: Article,
  group: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(changeMacroparameterInitialized());

    mutate({
      query: CHANGE_MACROPARAMETER,
      variables: {
        macroparameterSetId: selected?.id?.toString(),
        macroparameterGroupId: group?.id?.toString(),
        macroparameterId: macroparameter?.id?.toString(),
        caption: macroparameter.caption,
        unit: macroparameter.unit,
        value: macroparameter.value,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.changeMacroparameter;

        if (responseData && responseData?.macroparameter?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          const updatedMacroparameter = responseData?.macroparameter;

          if (updatedMacroparameter) {
            dispatch(changeMacroparameterSuccess(updatedMacroparameter as Article, group));
          }
        } else {
          dispatch(changeMacroparameterError('Error'));
        }
      })
      .catch((e) => {
        dispatch(changeMacroparameterError(e));
      });
  };
};
