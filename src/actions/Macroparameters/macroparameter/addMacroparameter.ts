import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from '../macroparameterSetList';

import { mutate } from '@/api/graphql-request';
import { ADD_MACROPARAMETER } from '@/api/macroparameters';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const MACROPARAM_ADD_INIT = 'MACROPARAM_ADD_INIT';
export const MACROPARAM_ADD_SUCCESS = 'MACROPARAM_ADD_SUCCESS';
export const MACROPARAM_ADD_ERROR = 'MACROPARAM_ADD_ERROR';

const macroparameterAddInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_ADD_INIT,
});

const macroparameterAddSuccess = (
  macroparameter: Article,
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
  newMacroparameter: Article,
  group: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterAddInitialized());

    mutate({
      query: ADD_MACROPARAMETER,
      variables: {
        macroparameterSetId: selected.id.toString(),
        macroparameterGroupId: group?.id?.toString(),
        caption: newMacroparameter.caption,
        unit: newMacroparameter.unit,
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.createMacroparameter;

        if (responseData && responseData.macroparameter?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          const { macroparameter } = responseData;

          if (macroparameter) {
            dispatch(macroparameterAddSuccess(macroparameter as Article, group));
          }
        } else {
          dispatch(macroparameterAddError('Error'));
        }
      })
      .catch((e) => {
        dispatch(macroparameterAddError(e));
      });
  };
};
