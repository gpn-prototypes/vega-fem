import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { MacroparamsAction } from '../macroparameterSetList';

import { mutate } from '@/api/graphql-request';
import { DELETE_MACROPARAMETER } from '@/api/macroparameters';
import { currentVersionFromSessionStorage } from '@/helpers/currentVersionFromSessionStorage';
import Article from '@/types/Article';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const MACROPARAM_DELETE_INIT = 'MACROPARAM_DELETE_INIT';
export const MACROPARAM_DELETE_SUCCESS = 'MACROPARAM_DELETE_SUCCESS';
export const MACROPARAM_DELETE_ERROR = 'MACROPARAM_DELETE_ERROR';

const macroparameterDeleteInitialized = (): MacroparamsAction => ({
  type: MACROPARAM_DELETE_INIT,
});

const macroparameterDeleteSuccess = (
  macroparameter: Article,
  group: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: MACROPARAM_DELETE_SUCCESS,
  payload: { macroparameter, group },
});

const macroparameterDeleteError = (message: any): MacroparamsAction => ({
  type: MACROPARAM_DELETE_ERROR,
  errorMessage: message,
});

export const requestDeleteMacroparameter = (
  macroparameter: Article,
  group: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(macroparameterDeleteInitialized());

    mutate({
      query: DELETE_MACROPARAMETER,
      variables: {
        macroparameterSetId: selected?.id?.toString(),
        macroparameterGroupId: group?.id?.toString(),
        macroparameterId: macroparameter?.id?.toString(),
        version: currentVersionFromSessionStorage(),
      },
      appendProjectId: true,
    })
      ?.then((response) => {
        const responseData = response?.data?.project?.deleteMacroparameter;
        if (responseData && responseData.result?.__typename !== 'Error') {
          sessionStorage.setItem('currentVersion', `${currentVersionFromSessionStorage() + 1}`);
          dispatch(macroparameterDeleteSuccess(macroparameter as Article, group));
        } else {
          dispatch(macroparameterDeleteError('Error'));
        }
      })
      .catch((e) => {
        dispatch(macroparameterDeleteError(e));
      });
  };
};
